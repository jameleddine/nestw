import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  setHeadersAuthorization,
  getAuthHeaders,
  getAdminAuthHeaders,
  setAdminHeadersAuthorization,
  setAdminSessionToken,
  getHeaders,
} from '../../../config/header';
import { CredentialDto } from './dto/Credential.dto';

@Injectable()
export class AuthService {
  constructor(private http: HttpService) {}

  async initSession(credential: CredentialDto) {
    let res: any;
    await this.http
      .get(
        `${process.env.BASE_URL}initSession`,
        getAuthHeaders(setHeadersAuthorization(credential)),
      )
      .toPromise()
      .then(({ data }) => {
        res = data;
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus,
            error: 'Erreur Données Invalides',
          },
          400,
        );
      });
    return res;
  }
  async initAdminSession() {
    let res: any;
    await this.http
      .get(
        `${process.env.BASE_URL}initSession`,
        getAdminAuthHeaders(setAdminHeadersAuthorization()),
      )
      .toPromise()
      .then(({ data }) => {
        setAdminSessionToken(data);
        res = data;
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus,
            error: 'Erreur Données Invalides',
          },
          400,
        );
      });
    return res;
  }

  async killSession(token: string): Promise<any> {
    let res: any;
    await this.http
      .get(`${process.env.BASE_URL}killSession/`, getHeaders(token))
      .toPromise()
      .then(() => {
        res = 'logout successful';
      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: HttpStatus,
            error: response.body,
          },
          response.status,
        );
      });
    return res;
  }
}
