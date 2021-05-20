import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMessage, Message } from '../message.model';
import { MessageService } from '../service/message.service';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;

  mxCellsSharedCollection: IMxCell[] = [];

  editForm = this.fb.group({
    id: [],
    mxCell: [],
  });

  constructor(
    protected messageService: MessageService,
    protected mxCellService: MxCellService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.updateForm(message);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.createFromForm();
    if (message.id !== undefined) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  trackMxCellById(index: number, item: IMxCell): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
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

  protected updateForm(message: IMessage): void {
    this.editForm.patchValue({
      id: message.id,
      mxCell: message.mxCell,
    });

    this.mxCellsSharedCollection = this.mxCellService.addMxCellToCollectionIfMissing(this.mxCellsSharedCollection, message.mxCell);
  }

  protected loadRelationshipsOptions(): void {
    this.mxCellService
      .query()
      .pipe(map((res: HttpResponse<IMxCell[]>) => res.body ?? []))
      .pipe(map((mxCells: IMxCell[]) => this.mxCellService.addMxCellToCollectionIfMissing(mxCells, this.editForm.get('mxCell')!.value)))
      .subscribe((mxCells: IMxCell[]) => (this.mxCellsSharedCollection = mxCells));
  }

  protected createFromForm(): IMessage {
    return {
      ...new Message(),
      id: this.editForm.get(['id'])!.value,
      mxCell: this.editForm.get(['mxCell'])!.value,
    };
  }
}
