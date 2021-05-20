import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface ITask {
  id?: number;
  mxCell?: IMxCell | null;
}

export class Task implements ITask {
  constructor(public id?: number, public mxCell?: IMxCell | null) {}
}

export function getTaskIdentifier(task: ITask): number | undefined {
  return task.id;
}
