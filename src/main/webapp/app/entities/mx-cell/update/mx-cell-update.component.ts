import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMxCell, MxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';

@Component({
  selector: 'jhi-mx-cell-update',
  templateUrl: './mx-cell-update.component.html',
})
export class MxCellUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    lg: [],
    style: [],
    value: [],
    parent: [],
    source: [],
    target: [],
  });

  constructor(protected mxCellService: MxCellService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mxCell }) => {
      this.updateForm(mxCell);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mxCell = this.createFromForm();
    if (mxCell.id !== undefined) {
      this.subscribeToSaveResponse(this.mxCellService.update(mxCell));
    } else {
      this.subscribeToSaveResponse(this.mxCellService.create(mxCell));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMxCell>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mxCell: IMxCell): void {
    this.editForm.patchValue({
      id: mxCell.id,
      lg: mxCell.lg,
      style: mxCell.style,
      value: mxCell.value,
      parent: mxCell.parent,
      source: mxCell.source,
      target: mxCell.target,
    });
  }

  protected createFromForm(): IMxCell {
    return {
      ...new MxCell(),
      id: this.editForm.get(['id'])!.value,
      lg: this.editForm.get(['lg'])!.value,
      style: this.editForm.get(['style'])!.value,
      value: this.editForm.get(['value'])!.value,
      parent: this.editForm.get(['parent'])!.value,
      source: this.editForm.get(['source'])!.value,
      target: this.editForm.get(['target'])!.value,
    };
  }
}
