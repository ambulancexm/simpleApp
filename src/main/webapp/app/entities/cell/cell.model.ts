export interface ICell {
  id?: number;
  name?: string | null;
  age?: number | null;
}

export class Cell implements ICell {
  constructor(public id?: number, public name?: string | null, public age?: number | null) {}
}

export function getCellIdentifier(cell: ICell): number | undefined {
  return cell.id;
}
