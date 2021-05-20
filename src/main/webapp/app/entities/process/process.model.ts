import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface IProcess {
  id?: number;
  mxCell?: IMxCell | null;
}

export class Process implements IProcess {
  constructor(public id?: number, public mxCell?: IMxCell | null) {}
}

export function getProcessIdentifier(process: IProcess): number | undefined {
  return process.id;
}
