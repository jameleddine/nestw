
import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation} from '@nestjs/swagger';
import { CredentialDto } from './dto/Credential.dto';
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('initiate')
  
  @ApiOperation({ summary: 'Authentication' })
  async initSession(@Body() credential: CredentialDto): Promise<any> {
    return await this.authService.initSession(credential);
  }
  @Post('initAdminSession')
  @ApiOperation({ summary: 'Authentication as an Admin' })
  async initAdminSession(): Promise<any> {
    return await this.authService.initAdminSession();
  }

  @ApiOperation({ summary: 'Logout' })
  @Get('killSession')
  async getAllTickets(@Headers('session-token') sessionToken : string): Promise<any> {
    return await this.authService.killSession(sessionToken);
  }
}
