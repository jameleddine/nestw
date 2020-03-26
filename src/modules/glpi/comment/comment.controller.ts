import { Controller, Get, Query , Headers} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get the comments by ticket id ' })
  @ApiQuery({name : 'ticketid'})
  async getTicketComments(
    @Headers('session-token') sessionToken: string,
    @Query('ticketid') id): Promise<any> {
    return await this.commentService.findTicketComments(id);
  }
}
