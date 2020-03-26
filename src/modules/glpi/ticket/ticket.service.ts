import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as fs from 'fs';
import * as request from 'request';
import { getHeaders } from '../../../config/header';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { GLPITicket } from './classes/ticket.class';
import { CreateTicketDto } from './dto/CreateTicket.dto';
@Injectable()
export class TicketService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}
  comments: any = [];

  async countTickets(token: string): Promise<any> {
    let res: any;

    await this.httpService
      .get(
        `${process.env.BASE_URL}search/Ticket?criteria[0][field]=22&criteria[0][searchtype]=notequals&criteria[0][value]=zzz&forcedisplay[0]=21&forcedisplay[1]=25&forcedisplay[2]=14&forcedisplay[3]=12&forcedisplay[4]=15&forcedisplay[5]=10&forcedisplay[6]=83&forcedisplay[7]=7&forcedisplay[8]=9&forcedisplay[9]=5&forcedisplay[10]=11&forcedisplay[11]=10&forcedisplay[12]=18&forcedisplay[13]=17&forcedisplay[14]=64&forcedisplay[15]=66&forcedisplay[16]=19&forcedisplay[17]=30&forcedisplay[18]=80&forcedisplay[19]=25&sort=2&order=DESC&range=0-1000`,
        getHeaders(token),
      )
      .toPromise()
      .then(({ data }) => {
        if (!data.data) {
          res = {
            count: 0,
            incidents: 0,
            demandes: 0,
          };
        } else {
          let nbIncident = 0;
          let nbDemande = 0;
          data.data.forEach(d => {
            if (d['14'] === 1) nbIncident++;
            else if (d['14'] === 2) nbDemande++;
          });
          res = {
            count: nbIncident + nbDemande,
            incidents: nbIncident,
            demandes: nbDemande,
          };
        }
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

  async findAllTickets(token: string, from: number, to: number): Promise<any> {
    let res: any = {};

    await this.httpService
      .get(
        `${process.env.BASE_URL}search/Ticket?criteria[0][field]=22&criteria[0][searchtype]=notequals&criteria[0][value]=zzz&forcedisplay[0]=21&forcedisplay[1]=25&forcedisplay[2]=14&forcedisplay[3]=12&forcedisplay[4]=15&forcedisplay[5]=10&forcedisplay[6]=83&forcedisplay[7]=7&forcedisplay[8]=9&forcedisplay[9]=5&forcedisplay[10]=11&forcedisplay[11]=10&forcedisplay[12]=18&forcedisplay[13]=17&forcedisplay[14]=64&forcedisplay[15]=66&forcedisplay[16]=19&forcedisplay[17]=30&forcedisplay[18]=80&forcedisplay[19]=25&sort=2&order=DESC&range=${from}-${to}`,
        getHeaders(token),
      )
      .toPromise()
      .then(({ data }) => {
        if (!data.data) {
          res = {
            count: 0,
            listTicket: [],
          };
        } else {
          const allTickets = data.data
            .filter(d => [1, 2].includes(d['14']))
            .map(t => new GLPITicket(t));
          res = {
            count: allTickets.length,
            listTicket: allTickets,
          };
        }
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

  async createTicket(
    ticket: CreateTicketDto,
    token: string,
  ): Promise<{ id: number; message: string }> {
    const url = `${process.env.BASE_URL}ticket`;
    let res: any;
    const regex = /\n/gi;
    await this.httpService
      .post(
        url,
        {
          input: {
            ...ticket,
            requesttypes_id: '9',
            content: `<p>${ticket.content.replace(regex, '<br>')}</p>`,
          },
        },
        getHeaders(token),
      )
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

  async createTicketWithFile(
    token: string,
    ticket,
  ): Promise<{ id: number; message: string }> {
    const url = `${process.env.BASE_URL}Ticket`;
    const backLineRegex = /\n/gi;
    const quotesRegex = /"/gi;
    const payload = `{
      "input": {
        "type": "${ticket.type}",
        "urgency": "${ticket.urgency}",
        "name": "${ticket.name.replace(quotesRegex, "'")}",
        "content": "<p>${ticket.content
          .replace(quotesRegex, "'")
          .replace(backLineRegex, '<br>')}</p>",
        "itilcategories_id":"${ticket.itilcategories_id}",
        "requesttypes_id": "9"
      }
    }`;
    const options = {
      method: 'POST',
      url: url,
      headers: {
        ...getHeaders(token).headers,
        'Content-Type': 'multipart/form-data',
      },
      formData: {
        'filename[0]': {
          value: fs.createReadStream(`./files/${ticket.file.filename}`),
          options: {
            filename: ticket.filename,
            contentType: null,
          },
        },
        uploadManifest: payload,
      },
    };
    const addTicketPromise = new Promise((resolve, reject) => {
      request.post(options, function(error, response) {
        if (error || response.statusCode !== 201) {
          reject(error || response.body);
          return;
        }
        resolve(response.body);
      });
    });
    let res: any;
    await addTicketPromise
      .then((resp: string) => {
        if (typeof resp === 'string') res = JSON.parse(resp);
        else
          throw new HttpException(
            'response is not valid: expected string',
            500,
          );
      })
      .catch(e => {
        throw new HttpException(e, 400);
      });
    return { id: res.id, message: res.message };
  }

  async assignFileToTicket(token: string, id: number, file: any): Promise<any> {
    const url = `${process.env.BASE_URL}Document`;
    const options = {
      method: 'POST',
      url: url,
      headers: {
        ...getHeaders(token).headers,
        'Content-Type': 'multipart/form-data',
      },
      formData: {
        'filename[0]': {
          value: fs.createReadStream(`./files/${file.filename}`),
          options: {
            filename: file.originalname,
            contentType: null,
          },
        },
        uploadManifest: `{
          "input":{
            "items_id": ${id},
            "itemtype": "Ticket",
            "name":"${file.originalname}"
          }
        }`,
      },
    };
    const updateTicketPromise = new Promise((resolve, reject) => {
      request.post(options, function(error, response) {
        if (error || response.statusCode !== 201) {
          reject(error || response.body);
          return;
        }
        resolve(response.body);
      });
    });
    let res: any;
    await updateTicketPromise
      .then((resp: string) => {
        if (typeof resp === 'string') res = JSON.parse(resp);
        else
          throw new HttpException(
            'response is not valid: expected string',
            500,
          );
      })
      .catch(e => {
        throw new HttpException(e, 400);
      });
    return { file: res };
  }

  async assignCommentToTicket(token: string, ticket: any) {
    let res: any;
    const { comment } = ticket;
    await this.httpService
      .post(
        `${process.env.BASE_URL}TicketFollowup`,
        { input: comment },
        getHeaders(token),
      )
      .toPromise()
      .then(reponse => {
        res = reponse.data;
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

    return { comment: res };
  }

  async findTicketById(token: string, id: number): Promise<any> {
    let res: any = {};

    await this.httpService
      .get(
        `${process.env.BASE_URL}search/Ticket?criteria[18][field]=22&criteria[18][searchtype]=notequals&criteria[18][value]=zzz&forcedisplay[18]=21&criteria[0][field]=2&criteria[0][searchtype]=equals&criteria[0][value]=${id}&forcedisplay[0]=2&forcedisplay[1]=25&forcedisplay[2]=14&forcedisplay[3]=12&forcedisplay[4]=15&forcedisplay[5]=10&forcedisplay[6]=83&forcedisplay[7]=7&forcedisplay[8]=9&forcedisplay[9]=5&forcedisplay[10]=11&forcedisplay[11]=10&forcedisplay[12]=18&forcedisplay[13]=17&forcedisplay[14]=64&forcedisplay[15]=66&forcedisplay[16]=19&sort=2&order=DESC&forcedisplay[17]=30&forcedisplay[18]=80&forcedisplay[19]=25&range=0-100`,
        getHeaders(token),
      )
      .toPromise()
      .then(({ data }) => {
       
          const allTickets =  (data.data || [])
          .filter(d => [1, 2].includes(d['14']))
          .map(t => new GLPITicket(t));
        res = allTickets[0] || [];

      })
      .catch(( error ) => {
        throw new HttpException(
          {
            status: error.status,
            error: error.data[0],
          },
          error.status,
        );
      });

    return res;
  }
}
