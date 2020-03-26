import {
  Injectable,
  HttpException,
  HttpStatus,
  HttpService,
} from '@nestjs/common';
import {
  getAdminHeaders,
  getAdminSessionToken,
  AdminHeadersDownloadDocument,
} from '../../../config/header';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import * as fs from 'fs';
import * as request from 'request';
import { first } from 'rxjs/operators';

@Injectable()
export class FileService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) { }

  async downloadDocument(id: string, filename: string) {
    let res;
    await this.authService.initAdminSession();
    const addTicketPromise = new Promise((resolve, reject) => {
      request(
        `${process.env.BASE_URL}Document/${id}/`,
        AdminHeadersDownloadDocument(getAdminSessionToken()),
        err => {
          if (err) reject(err);
        },
      )
        .pipe(
          fs.createWriteStream(`${process.env.UPLOAD_LOCATION}/${filename}`),
        )
        .on('error', err => reject('somthing went wrong! ' + err))
        .on('close', () =>
          resolve({
            msg: 'success',
            path: `${process.env.UPLOAD_LOCATION}/${filename}`,
          }),
        );
    });

    await addTicketPromise.then(resp => {
      res = resp;
    })
      .catch(error => {
        throw new HttpException(error, 400);
      });

    return res;
  }

  async findTicketDocuments(id: string) {
    let res: any;
    let allDocuments: any = [];
    let allDocumentDetails: any = [];
    await this.authService.initAdminSession();
    await this.httpService
      .get(
        `${process.env.BASE_URL}Ticket/${id}/Document_Item`,
        getAdminHeaders(getAdminSessionToken()),
      )
      .toPromise()
      .then(({ data }) => {
        allDocuments = data;

      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: response.status,
            error: response.data[0],
          },
          response.status,
        );
      });
    allDocumentDetails = await this.findDocuments(allDocuments);
    allDocumentDetails.length > 0 ? res = this.getDocumentUsers(allDocumentDetails) : res = [] ;
    return res;
  }
  async getDocumentUsers(documents) {
    const allDocuments = [];
    for (const document of documents) {
      const { filename, id, date_creation, users_id } = document;
      await this.userService
        .findUserById(users_id)
        .then(({ firstname: firstName, realname: lastName, name }) => {
          allDocuments.push({
            filename,
            id,
            date_creation,
            user: { id: users_id, firstName, lastName, name },
          });
        }).catch(({ response }) => {
          throw new HttpException(
            {
              status: response.status,
              error: response.data[0],
            },
            response.status,
          );
        })
    }
    return allDocuments;
  }

  async deleteFileFromServer(filename: any): Promise<any> {
    try {
      fs.unlinkSync(`${process.env.UPLOAD_LOCATION}/${filename}`);
    } catch (error) {
      throw new HttpException(
        `file not found at : ${process.env.UPLOAD_LOCATION}/${filename}`,
        404,
      );
    }
    return `file deleted succesfully: ${process.env.UPLOAD_LOCATION}/${filename}`;
  }

  async findDocumentById(id) {
    let res: any;
    await this.authService.initAdminSession();
    await this.httpService
      .get(`${process.env.BASE_URL}Document/${id}`, getAdminHeaders(getAdminSessionToken()))
      .toPromise()
      .then(({ data }) => {
        res = data;
      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: response.status,
            error: response.data[0],
          },
          response.status,
        );
      });
    return res;
  }

  async  findDocuments(documents: any) {
    const allDocuments = [];
    for (const document of documents) {
      await this.httpService.get(`${process.env.BASE_URL}Document/${document.documents_id}`, getAdminHeaders(getAdminSessionToken())).toPromise().then(({ data }) => {
        const document = {
          id: data.id,
          filename: data.filename,
          date_creation: data.date_creation,
          users_id: data.users_id
        }
        allDocuments.push(document)
      }).catch(error => {
        throw error;
      })
    }
    return allDocuments;
  }
}
