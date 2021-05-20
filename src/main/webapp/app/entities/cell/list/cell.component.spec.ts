import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CellService } from '../service/cell.service';

import { CellComponent } from './cell.component';

describe('Component Tests', () => {
  describe('Cell Management Component', () => {
    let comp: CellComponent;
    let fixture: ComponentFixture<CellComponent>;
    let service: CellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CellComponent],
      })
        .overrideTemplate(CellComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CellComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CellService);

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
      expect(comp.cells?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
