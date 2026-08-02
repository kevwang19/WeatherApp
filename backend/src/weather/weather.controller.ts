import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';

/**
 * HTTP layer for weather-related routes.
 * Validates query params here; delegates OpenWeather calls to WeatherService.
 */
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /** Search cities by name — returns up to 5 matching locations. */
  @Get('geocode')
  searchLocations(@Query('q') query?: string) {
    if (!query?.trim()) {
      throw new BadRequestException('Query parameter "q" is required');
    }

    return this.weatherService.searchLocations(query.trim());
  }

  /** Current conditions for a lat/lon pair. */
  @Get('weather/current')
  getCurrentWeather(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    const coords = this.parseCoords(lat, lon);
    return this.weatherService.getCurrentWeather(coords.lat, coords.lon);
  }

  /** 5-day forecast in 3-hour intervals for a lat/lon pair. */
  @Get('weather/forecast')
  getForecast(@Query('lat') lat?: string, @Query('lon') lon?: string) {
    const coords = this.parseCoords(lat, lon);
    return this.weatherService.getForecast(coords.lat, coords.lon);
  }

  /** Shared validation for lat/lon query params used by weather endpoints. */
  private parseCoords(lat?: string, lon?: string) {
    const parsedLat = Number(lat);
    const parsedLon = Number(lon);

    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon)) {
      throw new BadRequestException(
        'Query parameters "lat" and "lon" must be valid numbers',
      );
    }

    return { lat: parsedLat, lon: parsedLon };
  }
}
