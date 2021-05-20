import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICell, Cell } from '../cell.model';
import { CellService } from '../service/cell.service';

@Component({
  selector: 'jhi-cell-update',
  templateUrl: './cell-update.component.html',
})
export class CellUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    age: [],
  });

  constructor(protected cellService: CellService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cell }) => {
      this.updateForm(cell);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cell = this.createFromForm();
    if (cell.id !== undefined) {
      this.subscribeToSaveResponse(this.cellService.update(cell));
    } else {
      this.subscribeToSaveResponse(this.cellService.create(cell));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICell>>): void {
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

  protected updateForm(cell: ICell): void {
    this.editForm.patchValue({
      id: cell.id,
      name: cell.name,
      age: cell.age,
    });
  }

  protected createFromForm(): ICell {
    return {
      ...new Cell(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      age: this.editForm.get(['age'])!.value,
    };
  }
}
