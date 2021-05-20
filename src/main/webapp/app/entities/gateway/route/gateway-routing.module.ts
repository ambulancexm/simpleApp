import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GatewayComponent } from '../list/gateway.component';
import { GatewayDetailComponent } from '../detail/gateway-detail.component';
import { GatewayUpdateComponent } from '../update/gateway-update.component';
import { GatewayRoutingResolveService } from './gateway-routing-resolve.service';

const gatewayRoute: Routes = [
  {
    path: '',
    component: GatewayComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GatewayDetailComponent,
    resolve: {
      gateway: GatewayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GatewayUpdateComponent,
    resolve: {
      gateway: GatewayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GatewayUpdateComponent,
    resolve: {
      gateway: GatewayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gatewayRoute)],
  exports: [RouterModule],
})
export class GatewayRoutingModule {}
