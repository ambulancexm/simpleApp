import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MxCellService } from '../service/mx-cell.service';

import { MxCellComponent } from './mx-cell.component';

describe('Component Tests', () => {
  describe('MxCell Management Component', () => {
    let comp: MxCellComponent;
    let fixture: ComponentFixture<MxCellComponent>;
    let service: MxCellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MxCellComponent],
      })
        .overrideTemplate(MxCellComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MxCellComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MxCellService);

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
      expect(comp.mxCells?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
