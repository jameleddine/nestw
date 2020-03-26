import { ApiProperty } from '@nestjs/swagger';

export class EntityDto {
  @ApiProperty({
    description: 'Change The active entity',
  })
  entity_id: number;
}

