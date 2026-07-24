import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/configuration/environment.interface';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables>) {}
  getHello(): string {
    console.log(this.configService.get('PORT'));
    // console.log(this.configService.get('NODE_ENV'));
    return 'Hello World!';
  }
}
