import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as chalk from 'chalk';

import config from '../config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port, () => {
    console.log(chalk.green(`Application started on ${config.host}:${config.port}`));
  });
}
bootstrap();
