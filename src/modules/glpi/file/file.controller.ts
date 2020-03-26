import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Param,
  Query,
  HttpException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { FileService } from './file.service';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/FileUpload.dto';

const multerOptions = {
  limits: {
    fileSize: 100000000,
  },
  storage: diskStorage({
    destination: process.env.UPLOAD_LOCATION,
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'uploads a file' })
  @ApiBody({
    description: 'Fichier à charger',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'downloads a file' })
  @ApiQuery({ name: 'filename' })
  @ApiParam({ name: 'id' })
  async downloadDocument(
    @Res() res,
    @Param('id') id,
    @Query('filename') filename,
  ): Promise<any> {
    if (filename.split('.').length < 2)
      throw new HttpException('bad request', 400);
    const result = await this.fileService.downloadDocument(id, filename);
    return res.download(result.path);
  }
  @Delete()
  @ApiOperation({ summary: 'deletes a file from the server' })
  @ApiQuery({ name: 'filename' })
  async deleteDocument(@Query('filename') filename): Promise<any> {
    return await this.fileService.deleteFileFromServer(filename);
  }

  @Get()
  @ApiOperation({ summary: 'gets all ticket files' })
  @ApiQuery({
    name: 'ticket_id',
  })
  async getTicketDocuments(@Query('ticket_id') id) {
    return await this.fileService.findTicketDocuments(id);
  }
}
