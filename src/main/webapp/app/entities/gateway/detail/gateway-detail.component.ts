import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGateway } from '../gateway.model';

@Component({
  selector: 'jhi-gateway-detail',
  templateUrl: './gateway-detail.component.html',
})
export class GatewayDetailComponent implements OnInit {
  gateway: IGateway | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gateway }) => {
      this.gateway = gateway;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
