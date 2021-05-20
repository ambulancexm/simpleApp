import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MxCellComponent } from '../list/mx-cell.component';
import { MxCellDetailComponent } from '../detail/mx-cell-detail.component';
import { MxCellUpdateComponent } from '../update/mx-cell-update.component';
import { MxCellRoutingResolveService } from './mx-cell-routing-resolve.service';

const mxCellRoute: Routes = [
  {
    path: '',
    component: MxCellComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MxCellDetailComponent,
    resolve: {
      mxCell: MxCellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MxCellUpdateComponent,
    resolve: {
      mxCell: MxCellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MxCellUpdateComponent,
    resolve: {
      mxCell: MxCellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mxCellRoute)],
  exports: [RouterModule],
})
export class MxCellRoutingModule {}
