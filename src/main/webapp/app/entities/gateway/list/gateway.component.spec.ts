import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GatewayService } from '../service/gateway.service';

import { GatewayComponent } from './gateway.component';

describe('Component Tests', () => {
  describe('Gateway Management Component', () => {
    let comp: GatewayComponent;
    let fixture: ComponentFixture<GatewayComponent>;
    let service: GatewayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GatewayComponent],
      })
        .overrideTemplate(GatewayComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GatewayComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GatewayService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.gateways?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
