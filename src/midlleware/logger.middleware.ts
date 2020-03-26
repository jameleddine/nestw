import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    if (req.baseUrl === "/auth/initiate" || req.baseUrl.indexOf("/file") !==-1 ) {
      next();
    }
    else {
      if (req.headers["session-token"]) {
        next();
      }
      else {
        console.log('===req.baseUrl===',req.baseUrl)

        res.send({ statusCode: 401, message: "session-token is required" }).status(401)
      }
    }

  }
}
