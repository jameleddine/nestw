import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';

dotenv.config();
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
