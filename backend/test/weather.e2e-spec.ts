/// <reference types="jest" />

/**
 * E2E (end-to-end) TEST — full HTTP stack
 *
 * Unlike unit tests, this boots the real Nest app and sends actual HTTP
 * requests with supertest (like curl, but in code). WeatherService is still
 * mocked so we don't hit OpenWeather.
 *
 * Extra syntax:
 *   request(app.getHttpServer()) — send HTTP to the running test server
 *   .get('/path')                 — HTTP method + route
 *   .expect(200)                   — assert status code
 *   .expect({ ... })               — assert response body
 *   overrideProvider()             — swap real service for fake in the test app
 *   afterEach()                    — cleanup after each test (close the app)
 */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { WeatherService } from '../src/weather/weather.service';

describe('Weather API (e2e)', () => {
  let app: INestApplication<App>;

  const weatherService = {
    searchLocations: jest.fn(),
    getCurrentWeather: jest.fn(),
    getForecast: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Full AppModule, but replace WeatherService with our fake
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WeatherService)
      .useValue(weatherService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init(); // start listening (in memory, no real port needed)
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('GET /geocode rejects missing query', () => {
    // No ?q= param → controller validation should return 400
    return request(app.getHttpServer()).get('/geocode').expect(400);
  });

  it('GET /geocode returns results', () => {
    weatherService.searchLocations.mockResolvedValue([
      { name: 'Boston', lat: 42.36, lon: -71.06, country: 'US' },
    ]);

    return request(app.getHttpServer())
      .get('/geocode?q=Boston')
      .expect(200)
      .expect([{ name: 'Boston', lat: 42.36, lon: -71.06, country: 'US' }]);
  });
});
