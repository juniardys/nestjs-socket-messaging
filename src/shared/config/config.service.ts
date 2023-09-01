import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get app() {
    return {
      port: this.get('PORT') || 3000,
    };
  }

  get jwtConfig() {
    return {
      secret: this.get('JWT_SECRET'),
      expiry: this.get('JWT_EXPIRY'),
    };
  }

  get mongooseOptions() {
    return {
      uri: this.get('DATABASE_URL'),
    };
  }
}
