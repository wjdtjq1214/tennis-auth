import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfig {
  constructor() {
    return {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
      password: process.env.REDIS_PASS,
    };
  }
}
