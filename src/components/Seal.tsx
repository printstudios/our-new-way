export function Seal({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="#0f1b33" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#c4a35a" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#c4a35a" strokeWidth="0.6" />
      <path
        d="M60 22 L64 48 L90 48 L69 64 L77 90 L60 74 L43 90 L51 64 L30 48 L56 48 Z"
        fill="#c4a35a"
      />
      <path d="M28 78 C44 92, 76 92, 92 78" fill="none" stroke="#f4efe4" strokeWidth="1.2" />
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fill="#f4efe4"
        fontSize="7.2"
        letterSpacing="1.8"
        fontFamily="Lato, sans-serif"
      >
        DEUTSCHLAND
      </text>
    </svg>
  );
}
