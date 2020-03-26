import { Controller, Param, Get, Query, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiParam, ApiOperation } from '@nestjs/swagger';


@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('profile')
    
  @ApiOperation({ summary: 'Get User Profile by SessionToken' })
    getProfile(@Headers('session-token') sessionToken: string): Promise<{ status: string; data: any }> {
        return this.userService.findProfile(sessionToken);
    }

    @Get(':id')
    
  @ApiOperation({ summary: 'Get User Profile by ID' })
    @ApiParam({ name: 'id' })
    getAllUsers(@Param('id') id) {
        return this.userService.findUserById(id);
    }


}
