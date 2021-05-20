import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICell } from '../cell.model';
import { CellService } from '../service/cell.service';

@Component({
  templateUrl: './cell-delete-dialog.component.html',
})
export class CellDeleteDialogComponent {
  cell?: ICell;

  constructor(protected cellService: CellService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cellService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
