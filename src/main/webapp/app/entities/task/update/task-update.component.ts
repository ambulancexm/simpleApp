import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITask, Task } from '../task.model';
import { TaskService } from '../service/task.service';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;

  mxCellsSharedCollection: IMxCell[] = [];

  editForm = this.fb.group({
    id: [],
    mxCell: [],
  });

  constructor(
    protected taskService: TaskService,
    protected mxCellService: MxCellService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.createFromForm();
    if (task.id !== undefined) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  trackMxCellById(index: number, item: IMxCell): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.editForm.patchValue({
      id: task.id,
      mxCell: task.mxCell,
    });

    this.mxCellsSharedCollection = this.mxCellService.addMxCellToCollectionIfMissing(this.mxCellsSharedCollection, task.mxCell);
  }

  protected loadRelationshipsOptions(): void {
    this.mxCellService
      .query()
      .pipe(map((res: HttpResponse<IMxCell[]>) => res.body ?? []))
      .pipe(map((mxCells: IMxCell[]) => this.mxCellService.addMxCellToCollectionIfMissing(mxCells, this.editForm.get('mxCell')!.value)))
      .subscribe((mxCells: IMxCell[]) => (this.mxCellsSharedCollection = mxCells));
  }

  protected createFromForm(): ITask {
    return {
      ...new Task(),
      id: this.editForm.get(['id'])!.value,
      mxCell: this.editForm.get(['mxCell'])!.value,
    };
  }
}
