import { AuthService } from './../auth/auth.service';
import { Module, HttpModule } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  providers: [CategoryService , AuthService]
})
export class CategoryModule {}
