import type { ReactNode } from "react";

/** Small inline SVG icons paired with each weather stat on the current tab. */

export type WeatherStatType =
  | "feels-like"
  | "humidity"
  | "wind"
  | "pressure"
  | "visibility"
  | "hi-lo"
  | "sunrise"
  | "sunset";

const COLORS = {
  feelsLike: "#EF4444",
  humidity: "#3B82F6",
  humidityFill: "#BFDBFE",
  wind: "#64748B",
  pressure: "#7C3AED",
  visibility: "#0891B2",
  hiHigh: "#EF4444",
  hiLow: "#3B82F6",
  sunrise: "#FACC15",
  sunriseHorizon: "#FB923C",
  sunset: "#FB923C",
  sunsetHorizon: "#C084FC",
};

type WeatherStatIconProps = {
  type: WeatherStatType;
  size?: number;
};

function StatSvg({
  size,
  children,
}: {
  size: number;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="shrink-0"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function WeatherStatIcon({ type, size = 16 }: WeatherStatIconProps) {
  switch (type) {
    case "feels-like":
      return (
        <StatSvg size={size}>
          <path
            d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0Z"
            stroke={COLORS.feelsLike}
            fill={COLORS.feelsLike}
            fillOpacity={0.25}
          />
        </StatSvg>
      );
    case "humidity":
      return (
        <StatSvg size={size}>
          <path
            d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10Z"
            stroke={COLORS.humidity}
            fill={COLORS.humidityFill}
          />
        </StatSvg>
      );
    case "wind":
      return (
        <StatSvg size={size}>
          <path d="M4 8h9a3 3 0 1 0-3-3" stroke={COLORS.wind} />
          <path d="M4 14h13a3 3 0 1 1-3 3" stroke={COLORS.wind} />
          <path d="M4 20h7a2 2 0 1 0-2-2" stroke={COLORS.wind} />
        </StatSvg>
      );
    case "pressure":
      return (
        <StatSvg size={size}>
          <circle cx="12" cy="12" r="9" stroke={COLORS.pressure} />
          <path d="M12 7v5l3 2" stroke={COLORS.pressure} />
          <path d="M8 16h8" stroke={COLORS.pressure} />
        </StatSvg>
      );
    case "visibility":
      return (
        <StatSvg size={size}>
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
            stroke={COLORS.visibility}
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke={COLORS.visibility}
            fill={COLORS.visibility}
            fillOpacity={0.2}
          />
        </StatSvg>
      );
    case "hi-lo":
      return (
        <StatSvg size={size}>
          <path d="M12 19V5" stroke="#94A3B8" />
          <path d="m7 10 5-5 5 5" stroke={COLORS.hiHigh} />
          <path d="m7 16 5 5 5-5" stroke={COLORS.hiLow} />
        </StatSvg>
      );
    case "sunrise":
      return (
        <StatSvg size={size}>
          <path d="M12 3v6" stroke={COLORS.sunrise} />
          <path d="m5 10 2 2" stroke={COLORS.sunrise} />
          <path d="M19 10l-2 2" stroke={COLORS.sunrise} />
          <path d="M4 17h16" stroke={COLORS.sunriseHorizon} />
          <path d="m7 14 5-5 5 5" stroke={COLORS.sunrise} fill={COLORS.sunrise} fillOpacity={0.35} />
        </StatSvg>
      );
    case "sunset":
      return (
        <StatSvg size={size}>
          <path d="M12 10V3" stroke={COLORS.sunset} />
          <path d="m5 10 2 2" stroke={COLORS.sunset} />
          <path d="M19 10l-2 2" stroke={COLORS.sunset} />
          <path d="M4 17h16" stroke={COLORS.sunsetHorizon} />
          <path d="m7 14 5 5 5-5" stroke={COLORS.sunset} fill={COLORS.sunset} fillOpacity={0.35} />
        </StatSvg>
      );
  }
}

type WeatherStatProps = {
  type: WeatherStatType;
  children: ReactNode;
};

/** Stat row — icon + label/value text for the current conditions grid. */
export function WeatherStat({ type, children }: WeatherStatProps) {
  return (
    <p className="flex items-center gap-2">
      <WeatherStatIcon type={type} />
      {children}
    </p>
  );
}
