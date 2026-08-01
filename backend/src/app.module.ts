import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [HealthController],
})
export class AppModule {}
