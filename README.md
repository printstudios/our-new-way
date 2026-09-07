# Our New Way

Offene Bürgerplattform für das Bundesrecht der Bundesrepublik Deutschland.

Konzept-Demonstration: keine amtliche Stelle, Beschlüsse nicht rechtsverbindlich.
Der gesamte Bestand der auf [gesetze-im-internet.de](https://www.gesetze-im-internet.de/)
veröffentlichten Bundesgesetze und -verordnungen liegt im Register und kann
bewertet, diskutiert und durch Entwürfe fortgeschrieben werden.

## Prinzip

- Ein Land, ein Register, eine Stimme je Person (in der Demo: je Sitzung).
- Unparteiische Auszählung über Wilson-Heuristik, Quorum und sichtbare Schwellen.
- Neue Texte werden gegen den Bestand geprüft: Feld, Nähe, Widerspruch.
- Demonstrationsmodus erzeugt nachvollziehbare Aktivität für die Bühne.
- Der Code ist frei. Die Rechtstexte sind amtliche Werke und gemeinfrei.

## Start

```bash
npm install
python3 scripts/ingest_gesetze.py
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

## Produktion

```bash
docker build -t our-new-way .
docker run -p 8000:8000 our-new-way
```

Health: `GET /api/health`

## Herkunft der Texte

Quelle: Bundesministerium der Justiz / juris GmbH, TOC
`https://www.gesetze-im-internet.de/gii-toc.xml`.
Amtliche Werke sind nach § 5 Abs. 1 UrhG gemeinfrei.

## Lizenz der Software

MIT — siehe `LICENSE`.
