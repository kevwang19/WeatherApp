import { formatWindDirection } from "@/lib/format";

type WindArrowProps = {
  degrees: number;
  size?: number;
  className?: string;
};

export function WindArrow({ degrees, size = 16, className = "" }: WindArrowProps) {
  // Arrow points in the compass direction (matches N/NE/E label).
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <g transform={`rotate(${degrees} 12 12)`}>
        <line
          x1="12"
          y1="17"
          x2="12"
          y2="7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <polyline
          points="8,11 12,7 16,11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

type WindDisplayProps = {
  speed: number;
  degrees?: number;
  className?: string;
  align?: "start" | "end";
};

export default function WindDisplay({
  speed,
  degrees,
  className = "",
  align = "start",
}: WindDisplayProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${
        align === "end" ? "justify-end" : ""
      } ${className}`}
    >
      <span>Wind: {Math.round(speed)} mph</span>
      {degrees !== undefined && (
        <span className="inline-flex items-center gap-0.5">
          <WindArrow degrees={degrees} />
          <span>{formatWindDirection(degrees)}</span>
        </span>
      )}
    </span>
  );
}
