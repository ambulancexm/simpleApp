import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProcess, Process } from '../process.model';
import { ProcessService } from '../service/process.service';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

@Component({
  selector: 'jhi-process-update',
  templateUrl: './process-update.component.html',
})
export class ProcessUpdateComponent implements OnInit {
  isSaving = false;

  mxCellsSharedCollection: IMxCell[] = [];

  editForm = this.fb.group({
    id: [],
    mxCell: [],
  });

  constructor(
    protected processService: ProcessService,
    protected mxCellService: MxCellService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ process }) => {
      this.updateForm(process);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const process = this.createFromForm();
    if (process.id !== undefined) {
      this.subscribeToSaveResponse(this.processService.update(process));
    } else {
      this.subscribeToSaveResponse(this.processService.create(process));
    }
  }

  trackMxCellById(index: number, item: IMxCell): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProcess>>): void {
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

  protected updateForm(process: IProcess): void {
    this.editForm.patchValue({
      id: process.id,
      mxCell: process.mxCell,
    });

    this.mxCellsSharedCollection = this.mxCellService.addMxCellToCollectionIfMissing(this.mxCellsSharedCollection, process.mxCell);
  }

  protected loadRelationshipsOptions(): void {
    this.mxCellService
      .query()
      .pipe(map((res: HttpResponse<IMxCell[]>) => res.body ?? []))
      .pipe(map((mxCells: IMxCell[]) => this.mxCellService.addMxCellToCollectionIfMissing(mxCells, this.editForm.get('mxCell')!.value)))
      .subscribe((mxCells: IMxCell[]) => (this.mxCellsSharedCollection = mxCells));
  }

  protected createFromForm(): IProcess {
    return {
      ...new Process(),
      id: this.editForm.get(['id'])!.value,
      mxCell: this.editForm.get(['mxCell'])!.value,
    };
  }
}
