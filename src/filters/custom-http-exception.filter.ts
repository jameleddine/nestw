import { ArgumentsHost, Catch, ExceptionFilter , HttpException} from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
    catch(
      exception: HttpException,
      host: ArgumentsHost,
  ) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const status = exception.getStatus();
      let message = exception.getResponse();
      message = (message as HttpException).message || (message as any).error;

      response
          .status(status)
          .json({
              statusCode: status,
              message,
              timestamp: new Date().toISOString(),
             // method: request.method,
            //  path: request.url,
          });
  }
}
