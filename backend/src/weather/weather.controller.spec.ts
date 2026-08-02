/**
 * UNIT TEST — WeatherController
 *
 * Tests validation logic only. WeatherService is replaced with a fake (mock)
 * so we never call OpenWeather or the real service.
 *
 * Jest syntax cheat sheet:
 *   describe()  — groups related tests (like a folder label)
 *   it()        — one specific behavior to verify
 *   expect()    — assertion: "I expect this value/behavior to be true"
 *   jest.fn()   — creates a fake function we can spy on (was it called? with what args?)
 *   beforeEach()— runs before every it() — fresh setup so tests don't affect each other
 *   toThrow()   — expect the function to throw an error
 *   toHaveBeenCalledWith() — expect the fake was called with specific arguments
 */
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;

  // Fake WeatherService — jest.fn() creates trackable stand-ins for each method
  const weatherService = {
    searchLocations: jest.fn(),
    getCurrentWeather: jest.fn(),
    getForecast: jest.fn(),
  };

  // Build a minimal Nest app with only the controller + fake service
  beforeEach(async () => {
    jest.clearAllMocks(); // reset call history between tests

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [{ provide: WeatherService, useValue: weatherService }],
    }).compile();

    controller = module.get(WeatherController);
  });

  it('rejects geocode requests without a query', () => {
    // Wrap in () => ... because toThrow() needs a function to call
    expect(() => controller.searchLocations(undefined)).toThrow(
      BadRequestException,
    );
    expect(() => controller.searchLocations('   ')).toThrow(
      BadRequestException,
    );
  });

  it('passes trimmed coordinates to the service', async () => {
    // Tell the fake what to return when getCurrentWeather is called
    weatherService.getCurrentWeather.mockResolvedValue({ name: 'Boston' });

    await controller.getCurrentWeather('42.36', '-71.06');

    // Verify the controller parsed strings → numbers and forwarded them
    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(
      42.36,
      -71.06,
    );
  });

  it('rejects invalid lat/lon', () => {
    expect(() => controller.getCurrentWeather('abc', '-71')).toThrow(
      BadRequestException,
    );
  });
});
