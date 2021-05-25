import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMxCell } from '../mx-cell.model';

@Component({
  selector: 'jhi-mx-cell-detail',
  templateUrl: './mx-cell-detail.component.html',
})
export class MxCellDetailComponent implements OnInit {
  mxCell: IMxCell | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mxCell }) => {
      this.mxCell = mxCell;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
