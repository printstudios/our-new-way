import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { stdout } = await execFileAsync(
      "zip",
      ["-r", "-", "src", "scripts", "public", "package.json", "README.md", "LICENSE", "Dockerfile", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs"],
      { cwd: process.cwd(), maxBuffer: 20 * 1024 * 1024, encoding: "buffer" },
    );
    return new Response(new Uint8Array(stdout), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="our-new-way-source.zip"',
      },
    });
  } catch {
    return Response.redirect("https://github.com/printstudios/our-new-way/archive/refs/heads/main.zip", 302);
  }
}
