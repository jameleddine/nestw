import { Module, HttpModule } from '@nestjs/common';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule {}
