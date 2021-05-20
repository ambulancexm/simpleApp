import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';

@Component({
  templateUrl: './mx-cell-delete-dialog.component.html',
})
export class MxCellDeleteDialogComponent {
  mxCell?: IMxCell;

  constructor(protected mxCellService: MxCellService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mxCellService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
