import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';

@Injectable()
export class AppService {
  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    const { FILES_EXPIRATION_TIME, UPLOAD_LOCATION } = process.env;
    fs.readdir(UPLOAD_LOCATION, function(err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      files.forEach(filename => {
        const { birthtime } = fs.statSync(`${UPLOAD_LOCATION}/${filename}`);
        const now = new Date().getTime();
        const fileBirthTime = new Date(birthtime).getTime();
        const diff = now - fileBirthTime;
        if (diff / parseInt(FILES_EXPIRATION_TIME) > 1) {
          //delete file
          fs.unlinkSync(`${UPLOAD_LOCATION}/${filename}`);
        }
      });
    });
  }
}
