import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from './File.dto';

export class CreateTicketDto {
  @ApiProperty({ type: 'string' })
  type: string;
  @ApiProperty({ type: 'string' })
  urgency: string;
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  content: string;
  @ApiProperty({
    type: FileDto,
    required: false,
  })
  file?: {
    filename: string;
  };
}
