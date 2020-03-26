import { Module, HttpModule } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CommentController],
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  providers: [CommentService, AuthService, UserService],
})
export class CommentModule {}
