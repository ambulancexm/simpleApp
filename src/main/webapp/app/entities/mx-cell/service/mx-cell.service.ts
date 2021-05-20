import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMxCell, getMxCellIdentifier } from '../mx-cell.model';

export type EntityResponseType = HttpResponse<IMxCell>;
export type EntityArrayResponseType = HttpResponse<IMxCell[]>;

@Injectable({ providedIn: 'root' })
export class MxCellService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/mx-cells');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(mxCell: IMxCell): Observable<EntityResponseType> {
    return this.http.post<IMxCell>(this.resourceUrl, mxCell, { observe: 'response' });
  }

  update(mxCell: IMxCell): Observable<EntityResponseType> {
    return this.http.put<IMxCell>(`${this.resourceUrl}/${getMxCellIdentifier(mxCell) as number}`, mxCell, { observe: 'response' });
  }

  partialUpdate(mxCell: IMxCell): Observable<EntityResponseType> {
    return this.http.patch<IMxCell>(`${this.resourceUrl}/${getMxCellIdentifier(mxCell) as number}`, mxCell, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMxCell>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMxCell[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMxCellToCollectionIfMissing(mxCellCollection: IMxCell[], ...mxCellsToCheck: (IMxCell | null | undefined)[]): IMxCell[] {
    const mxCells: IMxCell[] = mxCellsToCheck.filter(isPresent);
    if (mxCells.length > 0) {
      const mxCellCollectionIdentifiers = mxCellCollection.map(mxCellItem => getMxCellIdentifier(mxCellItem)!);
      const mxCellsToAdd = mxCells.filter(mxCellItem => {
        const mxCellIdentifier = getMxCellIdentifier(mxCellItem);
        if (mxCellIdentifier == null || mxCellCollectionIdentifiers.includes(mxCellIdentifier)) {
          return false;
        }
        mxCellCollectionIdentifiers.push(mxCellIdentifier);
        return true;
      });
      return [...mxCellsToAdd, ...mxCellCollection];
    }
    return mxCellCollection;
  }
}
