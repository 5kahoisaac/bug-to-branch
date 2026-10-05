// Small inline icons so this folder has no icon-library dependency.

type IconProps = { className?: string };

const SVG_PROPS = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function MessageIcon({ className }: IconProps) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...SVG_PROPS} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...SVG_PROPS} width={14} height={14} strokeWidth={2.5} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
