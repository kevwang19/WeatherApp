type WeatherIconProps = {
  code: string;
  size?: number;
  className?: string;
};

const COLORS = {
  sun: "#FACC15",
  moon: "#F8FAFC",
  overcastCloud: "#D1D5DB",
  overcastHighlight: "#E5E7EB",
  precipCloud: "#93C5FD",
  precipCloudLight: "#BFDBFE",
  precipHighlight: "#E0F2FE",
  rain: "#38BDF8",
  snow: "#E2E8F0",
  lightning: "#FDE047",
  mist: "#94A3B8",
  nightSky: "#0F172A",
};

function Sun({ cx = 32, cy = 32, scale = 1 }: { cx?: number; cy?: number; scale?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <circle cx="0" cy="0" r="14" fill={COLORS.sun} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = Math.cos(rad) * 18;
        const y1 = Math.sin(rad) * 18;
        const x2 = Math.cos(rad) * 24;
        const y2 = Math.sin(rad) * 24;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={COLORS.sun}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Moon({ x = 22, y = 24 }: { x?: number; y?: number }) {
  return (
    <>
      <circle cx={x + 8} cy={y + 8} r="10" fill={COLORS.moon} />
      <circle cx={x + 13} cy={y + 6} r="8" fill={COLORS.nightSky} />
    </>
  );
}

function Cloud({
  variant = "grey",
  x = 14,
  y = 28,
  scale = 1,
}: {
  variant?: "grey" | "precip";
  x?: number;
  y?: number;
  scale?: number;
}) {
  const fill =
    variant === "precip" ? COLORS.precipCloud : COLORS.overcastCloud;
  const highlight =
    variant === "precip" ? COLORS.precipCloudLight : COLORS.overcastHighlight;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="18" cy="14" rx="14" ry="10" fill={fill} />
      <ellipse cx="28" cy="12" rx="12" ry="9" fill={fill} />
      <ellipse cx="10" cy="12" rx="9" ry="7" fill={highlight} opacity="0.7" />
    </g>
  );
}

function RainDrops() {
  return (
    <>
      <line x1="22" y1="44" x2="18" y2="52" stroke={COLORS.rain} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="44" x2="28" y2="52" stroke={COLORS.rain} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="44" x2="38" y2="52" stroke={COLORS.rain} strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function Lightning() {
  return (
    <polygon
      points="34,38 28,50 32,50 30,58 38,44 34,44"
      fill={COLORS.lightning}
    />
  );
}

function SnowFlakes() {
  return (
    <>
      <circle cx="22" cy="48" r="2" fill={COLORS.snow} />
      <circle cx="32" cy="52" r="2" fill={COLORS.snow} />
      <circle cx="42" cy="48" r="2" fill={COLORS.snow} />
    </>
  );
}

function ClearIcon({ isNight }: { isNight: boolean }) {
  if (isNight) {
    return (
      <>
        <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />
        <Moon x={20} y={18} />
      </>
    );
  }
  return <Sun cx={32} cy={32} />;
}

function PartlyCloudyIcon({
  isNight,
  scattered,
}: {
  isNight: boolean;
  scattered: boolean;
}) {
  if (isNight) {
    return (
      <>
        <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />
        <Moon x={8} y={8} />
        <Cloud variant="grey" x={20} y={24} scale={scattered ? 1 : 1.05} />
        {scattered && <Cloud variant="grey" x={6} y={32} scale={0.85} />}
      </>
    );
  }

  return (
    <>
      <Sun cx={18} cy={20} scale={0.72} />
      <Cloud variant="grey" x={22} y={26} scale={scattered ? 1 : 1.05} />
      {scattered && <Cloud variant="grey" x={8} y={34} scale={0.85} />}
    </>
  );
}

function OvercastIcon({ isNight }: { isNight: boolean }) {
  return (
    <>
      {isNight && <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />}
      <Cloud variant="grey" x={8} y={22} scale={1.15} />
      <Cloud variant="grey" x={20} y={30} scale={0.9} />
    </>
  );
}

function RainIcon({ isNight }: { isNight: boolean }) {
  return (
    <>
      {isNight && <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />}
      <Cloud variant="precip" x={10} y={18} />
      <RainDrops />
    </>
  );
}

function ThunderIcon({ isNight }: { isNight: boolean }) {
  return (
    <>
      {isNight && <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />}
      <Cloud variant="precip" x={10} y={16} scale={1.05} />
      <RainDrops />
      <Lightning />
    </>
  );
}

function SnowIcon({ isNight }: { isNight: boolean }) {
  return (
    <>
      {isNight && <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />}
      <Cloud variant="precip" x={10} y={18} />
      <SnowFlakes />
    </>
  );
}

function MistIcon({ isNight }: { isNight: boolean }) {
  return (
    <>
      {isNight && <rect width="64" height="64" rx="12" fill={COLORS.nightSky} />}
      {[34, 42, 50].map((y) => (
        <line
          key={y}
          x1="12"
          y1={y}
          x2="52"
          y2={y}
          stroke={COLORS.mist}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
    </>
  );
}

function renderIcon(code: string) {
  const type = code.slice(0, 2);
  const isNight = code.endsWith("n");

  switch (type) {
    case "01":
      return <ClearIcon isNight={isNight} />;
    case "02":
      return <PartlyCloudyIcon isNight={isNight} scattered={false} />;
    case "03":
      return <PartlyCloudyIcon isNight={isNight} scattered={true} />;
    case "04":
      return <OvercastIcon isNight={isNight} />;
    case "09":
    case "10":
      return <RainIcon isNight={isNight} />;
    case "11":
      return <ThunderIcon isNight={isNight} />;
    case "13":
      return <SnowIcon isNight={isNight} />;
    case "50":
      return <MistIcon isNight={isNight} />;
    default:
      return <OvercastIcon isNight={isNight} />;
  }
}

export default function WeatherIcon({
  code,
  size = 40,
  className = "",
}: WeatherIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {renderIcon(code)}
    </svg>
  );
}
