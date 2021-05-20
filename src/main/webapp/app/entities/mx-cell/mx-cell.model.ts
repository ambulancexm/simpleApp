import { ITask } from 'app/entities/task/task.model';
import { IEvent } from 'app/entities/event/event.model';
import { IGateway } from 'app/entities/gateway/gateway.model';
import { IMessage } from 'app/entities/message/message.model';
import { IProcess } from 'app/entities/process/process.model';

export interface IMxCell {
  id?: number;
  lg?: string | null;
  style?: string | null;
  tasks?: ITask[] | null;
  events?: IEvent[] | null;
  gateways?: IGateway[] | null;
  messages?: IMessage[] | null;
  processes?: IProcess[] | null;
}

export class MxCell implements IMxCell {
  constructor(
    public id?: number,
    public lg?: string | null,
    public style?: string | null,
    public tasks?: ITask[] | null,
    public events?: IEvent[] | null,
    public gateways?: IGateway[] | null,
    public messages?: IMessage[] | null,
    public processes?: IProcess[] | null
  ) {}
}

export function getMxCellIdentifier(mxCell: IMxCell): number | undefined {
  return mxCell.id;
}
