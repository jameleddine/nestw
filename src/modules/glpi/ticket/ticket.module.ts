import { Module, HttpModule } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
@Module({
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  providers: [TicketService, AuthService, UserService],
  controllers: [TicketController],
})
export class TicketModule { }
