import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICell } from '../cell.model';
import { CellService } from '../service/cell.service';
import { CellDeleteDialogComponent } from '../delete/cell-delete-dialog.component';

@Component({
  selector: 'jhi-cell',
  templateUrl: './cell.component.html',
})
export class CellComponent implements OnInit {
  cells?: ICell[];
  isLoading = false;

  constructor(protected cellService: CellService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cellService.query().subscribe(
      (res: HttpResponse<ICell[]>) => {
        this.isLoading = false;
        this.cells = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICell): number {
    return item.id!;
  }

  delete(cell: ICell): void {
    const modalRef = this.modalService.open(CellDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cell = cell;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
