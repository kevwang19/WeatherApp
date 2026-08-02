import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });
  // add origins to enable at deployment
  
  await app.listen(process.env.PORT ?? 3001);
}
// bootstrap() is async; void marks the promise as intentionally unawaited (top-level entry point)
void bootstrap();
