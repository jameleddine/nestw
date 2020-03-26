import {
  Injectable,
  HttpService,
  HttpException,
} from '@nestjs/common';
import { getHeaders } from '../../../config/header';

@Injectable()
export class EntityService {
  constructor(private readonly httpService: HttpService) { }
  /**
   *
   *
   * @param {string} token
   * @returns
   * @memberof EntityService
   */
  async findAllEntities(token: string) {
  let res: any;
  await this.httpService
  .get(`${process.env.BASE_URL}/getMyEntities/?is_recursive=1`, getHeaders(token))
  .toPromise()
  .then(({ data }) => {
    res = data;
      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: response.status,
            message: response.data[0],
          },
          response.status
          );
      });
    return res;
  }
  async findActiveEntity(token: string) {
    let res: any;
    await this.httpService
      .get(`${process.env.BASE_URL}/getActiveEntities`, getHeaders(token))
      .toPromise()
      .then(({ data }) => {
        res = data;
      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: response.status,
            message: response.data[0],
          },
          response.status
        );
      });
    return res;
  }
  async changeActiveEntity(token: string, entityId: any) {
    let res: any;
    await this.httpService
      .post(
        `${process.env.BASE_URL}/changeActiveEntities`,
        { entities_id: entityId, is_recursive: true },
        getHeaders(token),
      )
      .toPromise()
      .then(data => {
        res = { status: data.data };
      })
      .catch(({ response }) => {
        throw new HttpException(
          {
            status: response.status,
            message: response.data[0],
          },
          response.status
        );
      });
    return res;
  }
}
