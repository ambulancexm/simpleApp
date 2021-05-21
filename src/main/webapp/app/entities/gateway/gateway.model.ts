import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface IGateway {
  id?: number;
  mxCell?: IMxCell | null;
}

export class Gateway implements IGateway {
  constructor(public id?: number, public mxCell?: IMxCell | null) {}
}

export function getGatewayIdentifier(gateway: IGateway): number | undefined {
  return gateway.id;
}
