import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './Comment.dto';
import { FileDto } from './File.dto';

export class UpdateTicketDto {
  @ApiProperty({
    type: FileDto,
  })
  file?: {
    filename: string;
    originalname: string;
  };
  @ApiProperty({
    type: CommentDto,
  })
  comment?: {
    content: string;
  };
}
