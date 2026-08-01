import { BadGatewayException, Injectable } from '@nestjs/common';

const OPENWEATHER_API_KEY = '18a0193cf96323cd4515c10f75047a17';
const OPENWEATHER_DATA_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const DEFAULT_UNITS = 'imperial';

// constants and api keys explicitly included in this file for simplicity... in production the api keys would live as environment variables, the constants can be env vars or hardcoded depending on how often it is used

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

@Injectable()
export class WeatherService {
  async searchLocations(query: string): Promise<GeocodeResult[]> {
    const url = new URL(`${OPENWEATHER_GEO_URL}/direct`);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '5');
    url.searchParams.set('appid', OPENWEATHER_API_KEY);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const results = await response.json();
      return results.map(({ name, lat, lon, country, state }) => ({
        name,
        lat,
        lon,
        country,
        state,
      }));
    } catch (error) {
      console.error('OpenWeather request failed', error);
      throw new BadGatewayException('OpenWeather request failed');
    }
  }

  async getCurrentWeather(lat: number, lon: number) {
    const url = new URL(`${OPENWEATHER_DATA_URL}/weather`);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('units', DEFAULT_UNITS);
    url.searchParams.set('appid', OPENWEATHER_API_KEY);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      return response.json();
    } catch (error) {
      console.error('OpenWeather request failed', error);
      throw new BadGatewayException('OpenWeather request failed');
    }
  }

  async getForecast(lat: number, lon: number) {
    const url = new URL(`${OPENWEATHER_DATA_URL}/forecast`);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('units', DEFAULT_UNITS);
    url.searchParams.set('appid', OPENWEATHER_API_KEY);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      return response.json();
    } catch (error) {
      console.error('OpenWeather request failed', error);
      throw new BadGatewayException('OpenWeather request failed');
    }
  }
}
