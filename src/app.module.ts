import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from './midlleware/logger.middleware';
import { LoggingInterceptor } from './midlleware/logging.interceptor';

import { SharedModule } from './modules/shared/shared.module';
import { GlpiModule } from './modules/glpi/glpi.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SharedModule,
    LoggerMiddleware,
    LoggingInterceptor,
    GlpiModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, LoggerMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // .with('AppModule')
    // .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
