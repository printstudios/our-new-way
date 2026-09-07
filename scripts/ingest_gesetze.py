#!/usr/bin/env python3
"""Download and parse every federal German law from Gesetze-im-Internet."""

from __future__ import annotations

import argparse
import concurrent.futures
import io
import json
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

TOC_URL = "https://www.gesetze-im-internet.de/gii-toc.xml"
UA = "OurNewWay/1.0 (civic open-data ingest; +https://our-new-way.com)"
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
LAWS_DIR = DATA / "laws"
CATALOG_PATH = DATA / "catalog.json"
META_PATH = DATA / "ingest-meta.json"

AREA_RULES: list[tuple[str, list[str]]] = [
    ("verfassungsrecht", ["grundgesetz", "verfassung", "bundesverfassungs", "gg", "bverfg"]),
    ("strafrecht", ["straf", "stgb", "stpo", "jgg", "owig", "btmg", "waffg", "versamml"]),
    ("zivilrecht", ["bürgerlich", "bgb", "zpo", "gvg", "famfg", "wEG", "woeigg"]),
    ("sozialrecht", ["sozial", "sgb", "bafög", "bafog", "wohngeld", "asylb", "asylbLG".lower()]),
    ("steuerrecht", ["steuer", "estg", "kstg", "ustg", "ao", "abgaben", "zoll", "gewerbesteuer"]),
    ("arbeitsrecht", ["arbeit", "betrvg", "kschg", "burlg", "arbzg", "muschg", "entgelt", "mindestlohn", "tarif"]),
    ("umweltrecht", ["umwelt", "naturschutz", "immission", "wasserhaushalt", "kreislauf", "klimaschutz", "eeg", "bnatschg", "bimschg"]),
    ("wirtschaftsrecht", ["handels", "hgb", "gmbh", "aktiengesetz", "aktg", "wettbewerb", "gwb", "uwg", "insolvenz", "insO".lower()]),
    ("verwaltungsrecht", ["verwalt", "vwvg", "vwgo", "beamten", "bbg", "kommunal"]),
    ("gesundheitsrecht", ["gesundheit", "infektion", "ifsg", "amg", "arznei", "medizinprodukt", "sgb v"]),
    ("digitalrecht", ["telekommun", "telemedien", "tkg", "tmg", "ddg", "datenschutz", "bdsg", "online"]),
    ("migrationsrecht", ["aufenthalt", "asyl", "staatsangehör", "freizüg", "einbürger"]),
    ("baurecht", ["baugesetz", "baugb", "baunutz", "raumordnung", "wohnungs"]),
    ("verkehrsrecht", ["straßenverkehr", "stvo", "stvg", "eisenbahn", "luftverkehr", "seeschiff", "personenbeförder"]),
    ("bildungsrecht", ["hochschul", "berufsbild", "bafög", "schul"]),
    ("sicherheitsrecht", ["bundespolizei", "bka", "verfassungsschutz", "bverfgsch", "sicherheit", "krisen"]),
    ("wahlrecht", ["wahl", "partei", "bwahlg", "europawahl", "partg"]),
    ("energierecht", ["energie", "enwg", "atom", "kraft-wärme", "wärmeliefer"]),
]


def classify_area(title: str, slug: str, abbrev: str) -> str:
    blob = f"{title} {slug} {abbrev}".lower()
    for area, keys in AREA_RULES:
        if any(k.lower() in blob for k in keys):
            return area
    if slug.startswith("sgb"):
        return "sozialrecht"
    if "gesetz" in title.lower() and "steuer" in title.lower():
        return "steuerrecht"
    if title.lower().startswith("verordnung"):
        return "verordnung"
    return "sonstiges"


def strip_tags(xml: str) -> str:
    text = re.sub(r"<BR\s*/?>", "\n", xml, flags=re.I)
    text = re.sub(r"</P>", "\n\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    text = text.replace("&nbsp;", " ").replace("&#160;", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def fetch(url: str, timeout: int = 45) -> bytes:
    raw = subprocess.check_output(
        ["curl", "-fsSL", "-A", UA, "--retry", "3", "--retry-delay", "1", "--max-time", str(timeout), url],
        stderr=subprocess.STDOUT,
    )
    if not raw:
        raise RuntimeError(f"empty response for {url}")
    return raw


def parse_toc(xml: bytes) -> list[dict]:
    root = ET.fromstring(xml)
    items = []
    for item in root.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        if not title or not link:
            continue
        slug = link.rstrip("/").split("/")[-2] if link.endswith("xml.zip") else ""
        if not slug:
            m = re.search(r"gesetze-im-internet\.de/([^/]+)/", link)
            slug = m.group(1) if m else ""
        if not slug:
            continue
        items.append(
            {
                "slug": slug,
                "title": title,
                "sourceZip": link.replace("http://", "https://"),
                "sourceHtml": f"https://www.gesetze-im-internet.de/{slug}/",
            }
        )
    # unique by slug, keep first
    seen: set[str] = set()
    unique = []
    for it in items:
        if it["slug"] in seen:
            continue
        seen.add(it["slug"])
        unique.append(it)
    return unique


def parse_law_zip(payload: bytes, slug: str, toc_title: str) -> dict:
    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        names = [n for n in zf.namelist() if n.endswith(".xml")]
        if not names:
            raise ValueError("no xml in zip")
        xml = zf.read(names[0]).decode("utf-8", "replace")

    abbrev = ""
    date = ""
    stand = ""
    langue = toc_title
    m = re.search(r"<jurabk>(.*?)</jurabk>", xml)
    if m:
        abbrev = strip_tags(m.group(1))
    m = re.search(r"<ausfertigung-datum[^>]*>(.*?)</ausfertigung-datum>", xml)
    if m:
        date = strip_tags(m.group(1))
    m = re.search(r"<langue>(.*?)</langue>", xml)
    if m:
        langue = strip_tags(m.group(1)) or toc_title
    m = re.search(r"<standkommentar>(.*?)</standkommentar>", xml)
    if m:
        stand = strip_tags(m.group(1))

    sections = []
    for norm in re.findall(r"<norm\b[^>]*>.*?</norm>", xml, flags=re.S):
        enbez = ""
        titel = ""
        em = re.search(r"<enbez>(.*?)</enbez>", norm, flags=re.S)
        if em:
            enbez = strip_tags(em.group(1))
        tm = re.search(r"<titel[^>]*>(.*?)</titel>", norm, flags=re.S)
        if tm:
            titel = strip_tags(tm.group(1))
        body_bits = re.findall(r"<Content>(.*?)</Content>", norm, flags=re.S)
        body = strip_tags("\n".join(body_bits))
        if not enbez and not body:
            continue
        if enbez in {"", "Inhaltsübersicht"} and not body:
            continue
        sections.append(
            {
                "ref": enbez or "Abschnitt",
                "heading": titel[:240],
                "text": body[:12000],
            }
        )

    excerpt = ""
    for sec in sections:
        if sec["text"] and sec["ref"] not in {"Eingangsformel", "Inhaltsübersicht"}:
            excerpt = sec["text"][:420]
            break
    if not excerpt and sections:
        excerpt = (sections[0].get("text") or "")[:420]

    return {
        "slug": slug,
        "title": langue or toc_title,
        "tocTitle": toc_title,
        "abbrev": abbrev,
        "date": date,
        "stand": stand,
        "area": classify_area(f"{langue} {toc_title}", slug, abbrev),
        "sourceHtml": f"https://www.gesetze-im-internet.de/{slug}/",
        "sectionCount": len(sections),
        "excerpt": excerpt,
        "sections": sections,
    }


def download_one(item: dict, timeout: int) -> tuple[str, dict | None, str | None]:
    path = LAWS_DIR / f"{item['slug']}.json"
    if path.exists() and path.stat().st_size > 40:
        try:
            existing = json.loads(path.read_text("utf-8"))
            return item["slug"], existing, None
        except Exception:
            pass
    last_err = None
    for attempt in range(3):
        try:
            raw = fetch(item["sourceZip"], timeout=timeout)
            law = parse_law_zip(raw, item["slug"], item["title"])
            path.write_text(json.dumps(law, ensure_ascii=False, separators=(",", ":")), "utf-8")
            return item["slug"], law, None
        except Exception as exc:
            last_err = str(exc)
            time.sleep(0.4 * (attempt + 1))
    return item["slug"], None, last_err


def write_catalog(rows: list[dict], failed: list[dict], started: float) -> None:
    catalog = []
    for row in rows:
        catalog.append(
            {
                "slug": row["slug"],
                "title": row["title"],
                "tocTitle": row.get("tocTitle") or row["title"],
                "abbrev": row.get("abbrev") or "",
                "date": row.get("date") or "",
                "stand": row.get("stand") or "",
                "area": row.get("area") or "sonstiges",
                "sourceHtml": row.get("sourceHtml"),
                "sectionCount": row.get("sectionCount") or 0,
                "excerpt": row.get("excerpt") or "",
                "hasText": bool(row.get("sections")),
            }
        )
    catalog.sort(key=lambda r: (r["title"].casefold(), r["slug"]))
    CATALOG_PATH.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), "utf-8")
    META_PATH.write_text(
        json.dumps(
            {
                "source": TOC_URL,
                "license": "Amtliche Werke, gemeinfrei (§ 5 Abs. 1 UrhG). Quelle: Bundesministerium der Justiz / juris GmbH, gesetze-im-internet.de",
                "count": len(catalog),
                "failed": failed,
                "seconds": round(time.time() - started, 1),
                "builtAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            ensure_ascii=False,
            indent=2,
        ),
        "utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--timeout", type=int, default=40)
    parser.add_argument("--catalog-only", action="store_true")
    args = parser.parse_args()

    DATA.mkdir(parents=True, exist_ok=True)
    LAWS_DIR.mkdir(parents=True, exist_ok=True)
    started = time.time()

    print("Fetching TOC…", flush=True)
    toc_xml = fetch(TOC_URL, timeout=60)
    items = parse_toc(toc_xml)
    if args.limit:
        items = items[: args.limit]
    print(f"Found {len(items)} federal instruments.", flush=True)

    stub_rows = []
    for it in items:
        stub_rows.append(
            {
                "slug": it["slug"],
                "title": it["title"],
                "tocTitle": it["title"],
                "abbrev": "",
                "date": "",
                "stand": "",
                "area": classify_area(it["title"], it["slug"], ""),
                "sourceHtml": it["sourceHtml"],
                "sectionCount": 0,
                "excerpt": "",
                "sections": [],
            }
        )
    write_catalog(stub_rows, [], started)
    print(f"Wrote catalog stub → {CATALOG_PATH}", flush=True)
    if args.catalog_only:
        return 0

    ok: dict[str, dict] = {}
    failed: list[dict] = []
    done = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = [pool.submit(download_one, it, args.timeout) for it in items]
        for fut in concurrent.futures.as_completed(futs):
            slug, law, err = fut.result()
            done += 1
            if law:
                ok[slug] = law
            else:
                failed.append({"slug": slug, "error": err})
            if done % 50 == 0 or done == len(items):
                print(f"  {done}/{len(items)}  ok={len(ok)} fail={len(failed)}", flush=True)

    merged = []
    for it in items:
        merged.append(ok.get(it["slug"]) or next(r for r in stub_rows if r["slug"] == it["slug"]))
    write_catalog(merged, failed, started)
    print(
        f"Done. catalog={len(merged)} full_text={len(ok)} failed={len(failed)} in {time.time()-started:.1f}s",
        flush=True,
    )
    return 0 if len(ok) > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
