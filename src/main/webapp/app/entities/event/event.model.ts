import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface IEvent {
  id?: number;
  mxCell?: IMxCell | null;
}

export class Event implements IEvent {
  constructor(public id?: number, public mxCell?: IMxCell | null) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
