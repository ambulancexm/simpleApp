import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGateway } from '../gateway.model';
import { GatewayService } from '../service/gateway.service';
import { GatewayDeleteDialogComponent } from '../delete/gateway-delete-dialog.component';

@Component({
  selector: 'jhi-gateway',
  templateUrl: './gateway.component.html',
})
export class GatewayComponent implements OnInit {
  gateways?: IGateway[];
  isLoading = false;

  constructor(protected gatewayService: GatewayService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.gatewayService.query().subscribe(
      (res: HttpResponse<IGateway[]>) => {
        this.isLoading = false;
        this.gateways = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGateway): number {
    return item.id!;
  }

  delete(gateway: IGateway): void {
    const modalRef = this.modalService.open(GatewayDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.gateway = gateway;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
