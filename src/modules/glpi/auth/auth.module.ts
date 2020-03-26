import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports : [ HttpModule.register({
    timeout: 20000,
    maxRedirects: 10,
  }),],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
