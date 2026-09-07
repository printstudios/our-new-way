import type { LawStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/scoring";

const TONE: Record<LawStatus, string> = {
  in_kraft: "bg-navy text-paper-2",
  im_diskurs: "bg-[#2c3a58] text-paper-2",
  gefaehrdet: "bg-[#6b4a16] text-paper-2",
  zur_abwahl: "bg-no text-paper-2",
  entlassen: "bg-[#3b241f] text-paper-2",
  entwurf: "border border-gold text-navy bg-transparent",
  zur_annahme: "bg-yes text-paper-2",
  angenommen: "bg-[#143528] text-paper-2",
};

export function StatusPill({ status, label }: { status: LawStatus; label?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase ${TONE[status]}`}>
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
