export class GLPITicket {
  id: number;
  subject: string;
  domain: string;
  globalUrgency: string;
  impact: number;
  status: string;
  nature: string;
  incidentStart: string;
  due: string;
  content: string;
  creator: string;
  sla: string;
  response: string;
  lastComment: string;
  site: string;
  subDomain: string;
  client: string;
  expectedResolutDate: string;
  lastUpdater: string;
  LastUpdateDate: string;
  owner: any;
  country: any;
  creationDate: any;
  entity: any;

  constructor(ticket: any) {
    this.id = ticket[2];
    this.subject = ticket[1];
    this.domain = ticket[7];
    this.entity = ticket[80];
    this.globalUrgency = this.getUrgence(ticket[10]);
    this.impact = ticket[11];
    this.status = this.getStatus(ticket[12]);
    this.nature = this.getNature(ticket[14]);
    this.creationDate = null;
    this.incidentStart = ticket[15];
    this.due = ticket[18];
    this.content = ticket[21];
    this.creator = ticket[22];
    this.sla = ticket[30];
    this.response = typeof ticket[25] === 'string' ? [ticket[25]] : ticket[25];
    this.lastComment = ticket[25] ? [...ticket[25]].pop() : null;
    this.site = ticket[83];
    this.subDomain = ticket[9];
    this.client = ticket[5];
    this.expectedResolutDate = ticket[17];
    this.lastUpdater = ticket[64];
    this.LastUpdateDate = ticket[19];
    this.owner = null;
    this.country = null;
  }
  getUrgence(urgence) {
    switch (urgence.toString()) {
      case '1':
        return 'Très basse';
      case '2':
        return 'Basse';
      case '3':
        return 'Moyenne';
      case '4':
        return 'Haute';
      case '5':
        return 'Très haute';
      default:
        return 'non renseigné';
    }
  }

  getStatus(status) {
    switch (status.toString()) {
      case '1':
        return 'Nouveau';
      case '2':
        return 'En cours (Attribué)';
      case '3':
        return 'En cours (Planifié)';
      case '4':
        return 'En attente';
      case '5':
        return 'Résolu';
      case '6':
        return 'Clos';
      default:
        return 'non renseigné';
    }
  }

  getNature(nature) {
    switch (nature.toString()) {
      case '1':
        return 'Incident';
      case '2':
        return 'Request';
      default:
        return 'non renseigné';
    }
  }
}
