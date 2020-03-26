import { Module } from '@nestjs/common';
import { GlpiController } from './glpi.controller';
import { GlpiService } from './glpi.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EntityModule } from './entity/entity.module';
import { TicketModule } from './ticket/ticket.module';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, UserModule, EntityModule, TicketModule, FileModule, CommentModule, CategoryModule],
  controllers: [GlpiController],
  providers: [GlpiService],
})
export class GlpiModule {}
