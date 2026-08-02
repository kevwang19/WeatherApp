"use client";

import { FormEvent, useEffect, useState } from "react";
import WeatherIcon from "@/components/WeatherIcon";
import WindDisplay from "@/components/WindDisplay";
import { WeatherStat } from "@/components/WeatherStatIcon";
import {
  fetchCurrentWeather,
  fetchForecast,
  searchLocations,
  type CurrentWeather,
  type Forecast,
  type Location,
  type Tab,
} from "@/lib/api";
import { formatVisibility } from "@/lib/format";

const DEFAULT_LOCATION: Location = {
  name: "Charlotte",
  lat: 35.2271,
  lon: -80.8431,
  state: "North Carolina",
  country: "US",
};

const TABS: { id: Tab; label: string }[] = [
  { id: "current", label: "Current" },
  { id: "forecast", label: "5-Day Forecast" },
];

function formatLocation(location: Location) {
  const statePart = location.state ? `, ${location.state}` : "";
  return `${location.name}${statePart}, ${location.country}`;
}

function formatTime(unix: number) {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatForecastDay(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], {
    weekday: "short",
  });
}

function formatDateTime(unix: number) {
  return new Date(unix * 1000).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function rollupDailyForecast(
  forecastIntervals: Forecast["list"],
  cityTimezoneOffsetSeconds = 0,
) {
  const forecastsGroupedByDay = new Map<string, Forecast["list"]>();

  for (const interval of forecastIntervals) {
    const timestampSeconds = interval.dt;
    const localDateTime = new Date((timestampSeconds + cityTimezoneOffsetSeconds) * 1000);
    const calendarDate = `${localDateTime.getUTCFullYear()}-${localDateTime.getUTCMonth() + 1}-${localDateTime.getUTCDate()}`;
    const intervalsForDay = forecastsGroupedByDay.get(calendarDate) ?? [];
    intervalsForDay.push(interval);
    forecastsGroupedByDay.set(calendarDate, intervalsForDay);
  }

  return Array.from(forecastsGroupedByDay.entries()).map(
    ([calendarDate, intervalsForDay]) => ({
      date: calendarDate,
      tempHigh: Math.max(...intervalsForDay.map((interval) => interval.main.temp)),
      tempLow: Math.min(...intervalsForDay.map((interval) => interval.main.temp)),
      maxPop: Math.max(...intervalsForDay.map((interval) => interval.pop)),
      icon: intervalsForDay[0].weather[0].icon,
    }),
  );
}

export default function Home() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [tab, setTab] = useState<Tab>("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        if (tab === "current") {
          const data = await fetchCurrentWeather(location.lat, location.lon);
          if (!cancelled) setCurrent(data);
        } else {
          const data = await fetchForecast(location.lat, location.lon);
          if (!cancelled) setForecast(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [location, tab]);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setError(null);

    try {
      const results = await searchLocations(query);
      setSearchResults(results);

      if (results.length === 0) {
        setError("Location not found");
      }
    } catch (err) {
      setSearchResults([]);
      setError(err instanceof Error ? err.message : "Search failed");
    }
  }

  function selectLocation(result: Location) {
    setLocation(result);
    setSearchResults([]);
    setSearchQuery("");
    setCurrent(null);
    setForecast(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <header className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Weather for {formatLocation(location)}
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city ..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <ul className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            {searchResults.map((result) => (
              <li key={`${result.lat}-${result.lon}-${result.name}`}>
                <button
                  type="button"
                  onClick={() => selectLocation(result)}
                  className="w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {formatLocation(result)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </header>

      <nav className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`cursor-pointer border-b-2 px-3 py-2 text-sm ${
              tab === id
                ? "border-zinc-900 font-medium dark:border-zinc-100"
                : "border-transparent text-zinc-500"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-zinc-500">Loading...</p>}

      {!loading && tab === "current" && current && (
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <WeatherIcon code={current.weather[0].icon} size={80} />
            <div>
              <p className="text-5xl font-light">{Math.round(current.main.temp)}°</p>
              <p className="capitalize text-zinc-600 dark:text-zinc-400">
                {current.weather[0].description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <WeatherStat type="feels-like">
              Feels like: {Math.round(current.main.feels_like)}°
            </WeatherStat>
            <WeatherStat type="humidity">
              Humidity: {current.main.humidity}%
            </WeatherStat>
            <WeatherStat type="wind">
              <WindDisplay
                speed={current.wind.speed}
                degrees={current.wind.deg}
              />
            </WeatherStat>
            <WeatherStat type="pressure">
              Pressure: {current.main.pressure} hPa
            </WeatherStat>
            {current.visibility !== undefined && (
              <WeatherStat type="visibility">
                Visibility: {formatVisibility(current.visibility)}
              </WeatherStat>
            )}
            <WeatherStat type="hi-lo">
              Hi/Lo: {Math.round(current.main.temp_max)}° /{" "}
              {Math.round(current.main.temp_min)}°
            </WeatherStat>
            <WeatherStat type="sunrise">
              Sunrise: {formatTime(current.sys.sunrise)}
            </WeatherStat>
            <WeatherStat type="sunset">
              Sunset: {formatTime(current.sys.sunset)}
            </WeatherStat>
          </div>
        </section>
      )}

      {!loading && tab === "forecast" && forecast && (
        <section className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-zinc-500">Daily summary</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {rollupDailyForecast(
                forecast.list,
                forecast.city.timezone,
              ).map((dailySummary) => (
                <div
                  key={dailySummary.date}
                  className="flex min-w-24 shrink-0 flex-col items-center gap-1 rounded-lg border border-zinc-200 px-2 py-3 text-center text-sm dark:border-zinc-800"
                >
                  <p className="font-medium">
                    {formatForecastDay(dailySummary.date)}
                  </p>
                  <WeatherIcon code={dailySummary.icon} size={36} />
                  <p>
                    {Math.round(dailySummary.tempHigh)}° /{" "}
                    {Math.round(dailySummary.tempLow)}°
                  </p>
                  <p className="text-zinc-500">
                    {Math.round(dailySummary.maxPop * 100)}% rain
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-zinc-500">
              3 hour intervals over next 5 days
            </p>
            <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {forecast.list.map((entry) => (
              <li
                key={entry.dt}
                className="flex items-center gap-3 px-3 py-3 text-sm"
              >
                <p className="w-36 shrink-0 text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(entry.dt)}
                </p>
                <WeatherIcon code={entry.weather[0].icon} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{Math.round(entry.main.temp)}°</p>
                  <p className="truncate capitalize text-zinc-500">
                    {entry.weather[0].description}
                  </p>
                </div>
                <div className="shrink-0 text-right text-zinc-500">
                  <p>{Math.round(entry.pop * 100)}% rain</p>
                  <WindDisplay
                    speed={entry.wind.speed}
                    degrees={entry.wind.deg}
                    align="end"
                  />
                </div>
              </li>
            ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
