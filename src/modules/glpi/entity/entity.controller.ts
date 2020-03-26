import { Controller, Get, Body, Post, Headers } from '@nestjs/common';
import { EntityService } from './entity.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EntityDto } from './dto/entity.dto';

@Controller('entity')
@ApiTags('entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}
  @Get()
  @ApiOperation({ summary: 'Get all the entities' })
  async getAllEntities(
    @Headers('session-token') sessionToken: string,
  ): Promise<any> {
    const allEntities = await this.entityService.findAllEntities(sessionToken);
    const activeEntity = await this.entityService.findActiveEntity(
      sessionToken,
    );
    return {
      active: activeEntity.active_entity.id,
      entities: allEntities.myentities,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the active entity' })
  async getActiveEntity(
    @Headers('session-token') sessionToken: string,
  ): Promise<any> {
    return await this.entityService.findActiveEntity(sessionToken);
  }


  
  @Post('active')
  @ApiOperation({ summary: 'Change the active entity' })
  async updateActiveEntity(
    @Headers('session-token') sessionToken: string,
    @Body() entity: EntityDto): Promise<any> {
    return await this.entityService.changeActiveEntity(sessionToken, entity.entity_id);
  }
}
