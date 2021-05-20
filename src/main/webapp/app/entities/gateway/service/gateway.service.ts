import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGateway, getGatewayIdentifier } from '../gateway.model';

export type EntityResponseType = HttpResponse<IGateway>;
export type EntityArrayResponseType = HttpResponse<IGateway[]>;

@Injectable({ providedIn: 'root' })
export class GatewayService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/gateways');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(gateway: IGateway): Observable<EntityResponseType> {
    return this.http.post<IGateway>(this.resourceUrl, gateway, { observe: 'response' });
  }

  update(gateway: IGateway): Observable<EntityResponseType> {
    return this.http.put<IGateway>(`${this.resourceUrl}/${getGatewayIdentifier(gateway) as number}`, gateway, { observe: 'response' });
  }

  partialUpdate(gateway: IGateway): Observable<EntityResponseType> {
    return this.http.patch<IGateway>(`${this.resourceUrl}/${getGatewayIdentifier(gateway) as number}`, gateway, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGateway>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGateway[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGatewayToCollectionIfMissing(gatewayCollection: IGateway[], ...gatewaysToCheck: (IGateway | null | undefined)[]): IGateway[] {
    const gateways: IGateway[] = gatewaysToCheck.filter(isPresent);
    if (gateways.length > 0) {
      const gatewayCollectionIdentifiers = gatewayCollection.map(gatewayItem => getGatewayIdentifier(gatewayItem)!);
      const gatewaysToAdd = gateways.filter(gatewayItem => {
        const gatewayIdentifier = getGatewayIdentifier(gatewayItem);
        if (gatewayIdentifier == null || gatewayCollectionIdentifiers.includes(gatewayIdentifier)) {
          return false;
        }
        gatewayCollectionIdentifiers.push(gatewayIdentifier);
        return true;
      });
      return [...gatewaysToAdd, ...gatewayCollection];
    }
    return gatewayCollection;
  }
}
