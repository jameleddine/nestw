import { ApiProperty } from '@nestjs/swagger';

export class CredentialDto {
  @ApiProperty({
    description: 'your email',
    default: 'wadapp',
  })
  login: string;
  @ApiProperty({
    description: 'your password',
    default: 'wadapp',
  })
  pass: string;
}
