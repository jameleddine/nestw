import {
  Injectable,
  HttpService,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { getAdminHeaders, getAdminSessionToken } from '../../../config/header';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }
  async findTicketComments(id: string) {
    let res: any;
    await this.authService.initAdminSession();
    await this.httpService
      .get(
        `${process.env.BASE_URL}Ticket/${id}/TicketFollowup`,
        getAdminHeaders(getAdminSessionToken()),
      )
      .toPromise()
      .then(({ data }) => {
        res = data.map(
          ({ id: commentId, date, content, date_creation, users_id }) => ({
            commentId,
            date,
            content,
            date_creation,
            users_id,
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
    res = await this.getCommentUsers(res);
    return res;
  }

  async getCommentUsers(comments) {
    const allComments = [];
    for (const comment of comments) {
      const { commentId, date, content, date_creation, users_id: id } = comment;
      await this.userService
        .findUserById(id)
        .then(({ firstname: firstName, realname: lastName, name }) => {
          allComments.push({
            commentId,
            date,
            content,
            date_creation,
            user: { id, firstName, lastName, name },
          });
        });
    }
    return allComments;
  }
}
