import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('geocode')
  searchLocations(@Query('q') query?: string) {
    if (!query?.trim()) {
      throw new BadRequestException('Query parameter "q" is required');
    }

    return this.weatherService.searchLocations(query.trim());
  }

  @Get('weather/current')
  getCurrentWeather(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    const coords = this.parseCoords(lat, lon);
    return this.weatherService.getCurrentWeather(coords.lat, coords.lon);
  }

  @Get('weather/forecast')
  getForecast(@Query('lat') lat?: string, @Query('lon') lon?: string) {
    const coords = this.parseCoords(lat, lon);
    return this.weatherService.getForecast(coords.lat, coords.lon);
  }

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
