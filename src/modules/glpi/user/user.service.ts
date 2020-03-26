import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  getHeaders,
  getAdminHeaders,
  getAdminSessionToken
} from '../../../config/header';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService, private authService: AuthService) { }
  async findProfile(token: string): Promise<{ status: string; data: any }> {
    let res: any;
    await this.httpService
      .get(`${process.env.BASE_URL}getFullSession`, getHeaders(token))
      .toPromise()
      .then(resp => {
        const { status, data } = resp;
        res = { status, data };
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

  async findUserById(id: string) {
    let res: any;
    await this.authService.initAdminSession();
    await this.httpService
      .get(`${process.env.BASE_URL}User/${id}`, getAdminHeaders(getAdminSessionToken()))
      .toPromise()
      .then((reponse: any) => {
        const { id, name, realname, firstname } = reponse.data;
        const user = {
          id: id,
          name: name,
          realname: realname,
          firstname: firstname
        }
        res = user;
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

}
