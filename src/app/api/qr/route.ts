import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const value = url.searchParams.get("u") || "https://our-new-way.com";
  const svg = await QRCode.toString(value, {
    type: "svg",
    margin: 1,
    color: { dark: "#0f1b33", light: "#fbf8f1" },
    width: 240,
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
