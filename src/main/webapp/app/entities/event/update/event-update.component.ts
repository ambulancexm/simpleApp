import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEvent, Event } from '../event.model';
import { EventService } from '../service/event.service';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;

  mxCellsSharedCollection: IMxCell[] = [];

  editForm = this.fb.group({
    id: [],
    mxCell: [],
  });

  constructor(
    protected eventService: EventService,
    protected mxCellService: MxCellService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.updateForm(event);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  trackMxCellById(index: number, item: IMxCell): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
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

  protected updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      mxCell: event.mxCell,
    });

    this.mxCellsSharedCollection = this.mxCellService.addMxCellToCollectionIfMissing(this.mxCellsSharedCollection, event.mxCell);
  }

  protected loadRelationshipsOptions(): void {
    this.mxCellService
      .query()
      .pipe(map((res: HttpResponse<IMxCell[]>) => res.body ?? []))
      .pipe(map((mxCells: IMxCell[]) => this.mxCellService.addMxCellToCollectionIfMissing(mxCells, this.editForm.get('mxCell')!.value)))
      .subscribe((mxCells: IMxCell[]) => (this.mxCellsSharedCollection = mxCells));
  }

  protected createFromForm(): IEvent {
    return {
      ...new Event(),
      id: this.editForm.get(['id'])!.value,
      mxCell: this.editForm.get(['mxCell'])!.value,
    };
  }
}
