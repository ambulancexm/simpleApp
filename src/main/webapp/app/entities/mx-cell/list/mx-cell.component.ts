import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';
import { MxCellDeleteDialogComponent } from '../delete/mx-cell-delete-dialog.component';

@Component({
  selector: 'jhi-mx-cell',
  templateUrl: './mx-cell.component.html',
})
export class MxCellComponent implements OnInit {
  mxCells?: IMxCell[];
  isLoading = false;

  constructor(protected mxCellService: MxCellService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.mxCellService.query().subscribe(
      (res: HttpResponse<IMxCell[]>) => {
        this.isLoading = false;
        this.mxCells = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMxCell): number {
    return item.id!;
  }

  delete(mxCell: IMxCell): void {
    const modalRef = this.modalService.open(MxCellDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mxCell = mxCell;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
