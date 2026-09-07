"use client";

import { useEffect, useState } from "react";

export function QrFrame({
  value,
  caption,
}: {
  value: string;
  caption?: string;
}) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    fetch(`/api/qr?u=${encodeURIComponent(value)}`)
      .then((r) => r.text())
      .then(setSvg)
      .catch(() => setSvg(""));
  }, [value]);

  return (
    <figure className="paper-card p-5 text-center">
      <div
        className="mx-auto w-48 h-48 [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="mt-3 text-sm text-muted">
        {caption ?? value}
      </figcaption>
    </figure>
  );
}
