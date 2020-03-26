import {  getAdminSessionToken, getAdminHeaders } from './../../../config/header';
import { AuthService } from './../auth/auth.service';
import { Injectable, HttpService  ,  HttpException,} from '@nestjs/common';


@Injectable()
export class CategoryService {
    constructor(
        private readonly httpService : HttpService,
        private readonly authService : AuthService,
    ){ }

    async findCategoryByEntityId(id : any){
        let res : any ;
        await this.authService.initAdminSession();
        await this.httpService.get(
            `${process.env.BASE_URL}Entity/${id}/ITILCategory`,
            getAdminHeaders(getAdminSessionToken()),
        ).toPromise()
        .then(({ data }) => {
            res = data.map(
                ({ id , completename }) => ({
                  id ,
                  completename
                }),
              );
          })
        .catch(({ response }) => {
            throw new HttpException(
              {
                status: response.status,
                message: response.data[0],
              },
              response.status,
            );
          });
        return res;
    }
}
