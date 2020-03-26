import { CategoryService } from './category.service';
import { Controller, Get, Query ,  Headers, } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation } from '@nestjs/swagger';


@ApiTags('Category')
@Controller('category')
export class CategoryController {
constructor(private readonly categoryService : CategoryService){}

@Get()
@ApiOperation({ summary: 'Get the category by the entity id' })
@ApiQuery({name : 'entityid'})
async getCategoryByEntity(
    @Headers('session-token') sessionToken: string,
    @Query('entityid') id
 ) : Promise<any>{
    return await this.categoryService.findCategoryByEntityId(id);
}

}
