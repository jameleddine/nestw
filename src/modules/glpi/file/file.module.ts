import { Module, HttpModule } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [FileController],
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  providers: [FileService, AuthService, UserService],
})
export class FileModule {}
