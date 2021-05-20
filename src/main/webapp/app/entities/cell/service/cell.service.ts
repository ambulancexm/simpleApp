import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICell, getCellIdentifier } from '../cell.model';

export type EntityResponseType = HttpResponse<ICell>;
export type EntityArrayResponseType = HttpResponse<ICell[]>;

@Injectable({ providedIn: 'root' })
export class CellService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/cells');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(cell: ICell): Observable<EntityResponseType> {
    return this.http.post<ICell>(this.resourceUrl, cell, { observe: 'response' });
  }

  update(cell: ICell): Observable<EntityResponseType> {
    return this.http.put<ICell>(`${this.resourceUrl}/${getCellIdentifier(cell) as number}`, cell, { observe: 'response' });
  }

  partialUpdate(cell: ICell): Observable<EntityResponseType> {
    return this.http.patch<ICell>(`${this.resourceUrl}/${getCellIdentifier(cell) as number}`, cell, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICell>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICell[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCellToCollectionIfMissing(cellCollection: ICell[], ...cellsToCheck: (ICell | null | undefined)[]): ICell[] {
    const cells: ICell[] = cellsToCheck.filter(isPresent);
    if (cells.length > 0) {
      const cellCollectionIdentifiers = cellCollection.map(cellItem => getCellIdentifier(cellItem)!);
      const cellsToAdd = cells.filter(cellItem => {
        const cellIdentifier = getCellIdentifier(cellItem);
        if (cellIdentifier == null || cellCollectionIdentifiers.includes(cellIdentifier)) {
          return false;
        }
        cellCollectionIdentifiers.push(cellIdentifier);
        return true;
      });
      return [...cellsToAdd, ...cellCollection];
    }
    return cellCollection;
  }
}
