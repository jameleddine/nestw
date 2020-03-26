import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ type: 'string' })
  filename: string;
  @ApiProperty({ type: 'string', required: false })
  originalname?: string;
}
