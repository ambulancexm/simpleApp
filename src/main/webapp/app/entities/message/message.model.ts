import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface IMessage {
  id?: number;
  mxCell?: IMxCell | null;
}

export class Message implements IMessage {
  constructor(public id?: number, public mxCell?: IMxCell | null) {}
}

export function getMessageIdentifier(message: IMessage): number | undefined {
  return message.id;
}
