import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ type: 'string' })
  content: string;
}
