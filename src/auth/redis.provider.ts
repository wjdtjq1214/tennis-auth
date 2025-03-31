import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { RedisConfig } from 'src/config/redis.config';

@Injectable()
export class RedisProvider {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(RedisConfig);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string) {
    return await this.redisClient.set(
      key,
      value,
      'EX',
      parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '1209600'),
    );
  }
}
