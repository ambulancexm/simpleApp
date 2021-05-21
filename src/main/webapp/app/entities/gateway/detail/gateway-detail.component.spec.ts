import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayDetailComponent } from './gateway-detail.component';

describe('Component Tests', () => {
  describe('Gateway Management Detail Component', () => {
    let comp: GatewayDetailComponent;
    let fixture: ComponentFixture<GatewayDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GatewayDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ gateway: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GatewayDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GatewayDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load gateway on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.gateway).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
