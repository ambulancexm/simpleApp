import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGateway, Gateway } from '../gateway.model';
import { GatewayService } from '../service/gateway.service';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

@Component({
  selector: 'jhi-gateway-update',
  templateUrl: './gateway-update.component.html',
})
export class GatewayUpdateComponent implements OnInit {
  isSaving = false;

  mxCellsSharedCollection: IMxCell[] = [];

  editForm = this.fb.group({
    id: [],
    mxCell: [],
  });

  constructor(
    protected gatewayService: GatewayService,
    protected mxCellService: MxCellService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gateway }) => {
      this.updateForm(gateway);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gateway = this.createFromForm();
    if (gateway.id !== undefined) {
      this.subscribeToSaveResponse(this.gatewayService.update(gateway));
    } else {
      this.subscribeToSaveResponse(this.gatewayService.create(gateway));
    }
  }

  trackMxCellById(index: number, item: IMxCell): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGateway>>): void {
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

  protected updateForm(gateway: IGateway): void {
    this.editForm.patchValue({
      id: gateway.id,
      mxCell: gateway.mxCell,
    });

    this.mxCellsSharedCollection = this.mxCellService.addMxCellToCollectionIfMissing(this.mxCellsSharedCollection, gateway.mxCell);
  }

  protected loadRelationshipsOptions(): void {
    this.mxCellService
      .query()
      .pipe(map((res: HttpResponse<IMxCell[]>) => res.body ?? []))
      .pipe(map((mxCells: IMxCell[]) => this.mxCellService.addMxCellToCollectionIfMissing(mxCells, this.editForm.get('mxCell')!.value)))
      .subscribe((mxCells: IMxCell[]) => (this.mxCellsSharedCollection = mxCells));
  }

  protected createFromForm(): IGateway {
    return {
      ...new Gateway(),
      id: this.editForm.get(['id'])!.value,
      mxCell: this.editForm.get(['mxCell'])!.value,
    };
  }
}
