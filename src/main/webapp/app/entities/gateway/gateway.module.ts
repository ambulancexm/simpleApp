import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { GatewayComponent } from './list/gateway.component';
import { GatewayDetailComponent } from './detail/gateway-detail.component';
import { GatewayUpdateComponent } from './update/gateway-update.component';
import { GatewayDeleteDialogComponent } from './delete/gateway-delete-dialog.component';
import { GatewayRoutingModule } from './route/gateway-routing.module';

@NgModule({
  imports: [SharedModule, GatewayRoutingModule],
  declarations: [GatewayComponent, GatewayDetailComponent, GatewayUpdateComponent, GatewayDeleteDialogComponent],
  entryComponents: [GatewayDeleteDialogComponent],
})
export class GatewayModule {}
