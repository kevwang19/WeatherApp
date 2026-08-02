/** Shared types mirroring the backend/OpenWeather response shapes. */

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type Tab = "current" | "forecast";

export interface CurrentWeather {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number; deg?: number };
  visibility?: number;
  sys: { sunrise: number; sunset: number; country: string };
}

export interface Forecast {
  city: { name: string; country: string; timezone?: number };
  list: Array<{
    dt: number;
    main: { temp: number; feels_like: number };
    weather: Array<{ description: string; icon: string }>;
    pop: number;
    wind: { speed: number; deg?: number };
  }>;
}

/** Base URL for the NestJS backend — swap for NEXT_PUBLIC_API_URL in production. */
const API_BASE = "http://localhost:3001";

/** Shared fetch wrapper — throws with the API error message on non-2xx responses. */
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.message === "string"
        ? body.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}

/** Search cities by name via GET /geocode. */
export function searchLocations(query: string) {
  return get<Location[]>(`/geocode?q=${encodeURIComponent(query)}`);
}

/** Fetch current conditions for coordinates via GET /weather/current. */
export function fetchCurrentWeather(lat: number, lon: number) {
  return get<CurrentWeather>(`/weather/current?lat=${lat}&lon=${lon}`);
}

/** Fetch 5-day forecast for coordinates via GET /weather/forecast. */
export function fetchForecast(lat: number, lon: number) {
  return get<Forecast>(`/weather/forecast?lat=${lat}&lon=${lon}`);
}
