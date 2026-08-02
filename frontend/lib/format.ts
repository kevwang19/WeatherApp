/** Display helpers for wind direction, visibility, and speed. */

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/** Map degrees (0–360) to the nearest 8-point compass label. */
export function formatWindDirection(degrees: number) {
  const index = Math.round(degrees / 45) % 8;
  return COMPASS[index];
}

/** Convert OpenWeather visibility (meters) to miles for display. */
export function formatVisibility(meters: number) {
  if (meters >= 10000) {
    return "10+ mi";
  }

  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export function formatWind(speed: number, degrees?: number) {
  const direction =
    degrees !== undefined ? ` ${formatWindDirection(degrees)}` : "";
  return `${Math.round(speed)} mph${direction}`;
}
