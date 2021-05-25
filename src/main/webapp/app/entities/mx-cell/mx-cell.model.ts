export interface IMxCell {
  id?: number;
  lg?: string | null;
  style?: string | null;
  value?: string | null;
  parent?: string | null;
  source?: string | null;
  target?: string | null;
}

export class MxCell implements IMxCell {
  constructor(
    public id?: number,
    public lg?: string | null,
    public style?: string | null,
    public value?: string | null,
    public parent?: string | null,
    public source?: string | null,
    public target?: string | null
  ) {}
}

export function getMxCellIdentifier(mxCell: IMxCell): number | undefined {
  return mxCell.id;
}
