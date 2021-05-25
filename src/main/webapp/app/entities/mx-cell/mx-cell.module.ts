import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MxCellComponent } from './list/mx-cell.component';
import { MxCellDetailComponent } from './detail/mx-cell-detail.component';
import { MxCellUpdateComponent } from './update/mx-cell-update.component';
import { MxCellDeleteDialogComponent } from './delete/mx-cell-delete-dialog.component';
import { MxCellRoutingModule } from './route/mx-cell-routing.module';

@NgModule({
  imports: [SharedModule, MxCellRoutingModule],
  declarations: [MxCellComponent, MxCellDetailComponent, MxCellUpdateComponent, MxCellDeleteDialogComponent],
  entryComponents: [MxCellDeleteDialogComponent],
})
export class MxCellModule {}
