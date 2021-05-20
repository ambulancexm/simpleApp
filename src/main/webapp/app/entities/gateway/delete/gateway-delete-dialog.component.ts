import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGateway } from '../gateway.model';
import { GatewayService } from '../service/gateway.service';

@Component({
  templateUrl: './gateway-delete-dialog.component.html',
})
export class GatewayDeleteDialogComponent {
  gateway?: IGateway;

  constructor(protected gatewayService: GatewayService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gatewayService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
