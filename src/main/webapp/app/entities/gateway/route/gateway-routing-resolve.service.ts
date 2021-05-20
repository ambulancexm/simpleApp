import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGateway, Gateway } from '../gateway.model';
import { GatewayService } from '../service/gateway.service';

@Injectable({ providedIn: 'root' })
export class GatewayRoutingResolveService implements Resolve<IGateway> {
  constructor(protected service: GatewayService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGateway> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gateway: HttpResponse<Gateway>) => {
          if (gateway.body) {
            return of(gateway.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Gateway());
  }
}
