/**
 * UNIT TEST — WeatherService
 *
 * Tests how we talk to OpenWeather. global.fetch is replaced with a fake
 * so no real HTTP requests are made.
 *
 * Extra syntax:
 *   mockResolvedValue() — fake async function returns this value (simulates success)
 *   mockRejectedValue() — fake async function throws (simulates network failure)
 *   resolves.toEqual()  — for async: expect the promise to resolve to this value
 *   rejects.toThrow()   — for async: expect the promise to reject with this error
 *   spyOn()             — replace a real method (here console.error) to keep test output clean
 */
import { BadGatewayException } from '@nestjs/common';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  const fetchMock = jest.fn();

  beforeEach(() => {
    service = new WeatherService();
    fetchMock.mockReset();
    global.fetch = fetchMock; // all fetch() calls in tests go through our fake
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // put console.error back to normal after each test
  });

  it('maps geocode results to the fields the frontend needs', async () => {
    // Simulate OpenWeather returning a full payload
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            name: 'Boston',
            lat: 42.36,
            lon: -71.06,
            country: 'US',
            state: 'MA',
          },
        ]),
    });

    // Our service should strip/map to only the fields we expose
    await expect(service.searchLocations('Boston')).resolves.toEqual([
      { name: 'Boston', lat: 42.36, lon: -71.06, country: 'US', state: 'MA' },
    ]);
  });

  it('throws BadGatewayException when OpenWeather fails', async () => {
    // Simulate OpenWeather returning an error status (e.g. 502)
    fetchMock.mockResolvedValue({ ok: false, status: 502 });

    await expect(service.searchLocations('Boston')).rejects.toThrow(
      BadGatewayException,
    );
  });

  it('returns current weather JSON on success', async () => {
    const payload = { name: 'Boston', main: { temp: 72 } };
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });

    // Happy path: upstream JSON passes through unchanged
    await expect(service.getCurrentWeather(42.36, -71.06)).resolves.toEqual(
      payload,
    );
  });
});
