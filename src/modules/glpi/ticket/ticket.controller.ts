import {
  Controller,
  Post,
  Headers,
  Body,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/CreateTicket.dto';
import { UpdateTicketDto } from './dto/UpdateTicket.dto';

@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('count')
  @ApiOperation({ summary: 'gets tickets counts' })
  async countTickets(
    @Headers('session-token') sessionToken: string,
  ): Promise<any> {
    return await this.ticketService.countTickets(sessionToken);
  }

  @Get()
  @ApiOperation({ summary: 'gets all tickets' })
  async getAllTickets(
    @Headers('session-token') sessionToken: string,
    @Query('from') from: number,
    @Query('to') to: number,
  ): Promise<any> {
    return await this.ticketService.findAllTickets(sessionToken, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get the Ticket By ID' })
  async getAllTicketsById(
    @Headers('session-token') sessionToken: string,
    @Param('id') ticketId: number,
  ): Promise<any> {
    return await this.ticketService.findTicketById(sessionToken , ticketId);
  }

  @Post()
  @ApiOperation({ summary: 'add a ticket' })
  async addTicket(
    @Headers('session-token') sessionToken: string,
    @Body() ticket: CreateTicketDto,
  ): Promise<any> {
    if (ticket.file)
      return await this.ticketService.createTicketWithFile(
        sessionToken,
        ticket,
      );
    return await this.ticketService.createTicket(ticket, sessionToken);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update a ticket: adds a comment or a file' })
  async updateTicket(
    @Headers('session-token') sessionToken: string,
    @Param('id') ticketId: number,
    @Body() ticket: UpdateTicketDto,
  ): Promise<any> {
    let responseFile;
    let responseComment;
    if (ticket.file) {
      responseFile = await this.ticketService.assignFileToTicket(
        sessionToken,
        ticketId,
        ticket.file,
      );
    }

    if (ticket.comment) {
      responseComment = await this.ticketService.assignCommentToTicket(
        sessionToken,
        ticket,
      );
    }
    return { ...responseFile, ...responseComment };
  }
}
