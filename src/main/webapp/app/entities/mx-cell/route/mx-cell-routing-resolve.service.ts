import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMxCell, MxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';

@Injectable({ providedIn: 'root' })
export class MxCellRoutingResolveService implements Resolve<IMxCell> {
  constructor(protected service: MxCellService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMxCell> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mxCell: HttpResponse<MxCell>) => {
          if (mxCell.body) {
            return of(mxCell.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MxCell());
  }
}
