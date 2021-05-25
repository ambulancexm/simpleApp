import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MxCellDetailComponent } from './mx-cell-detail.component';

describe('Component Tests', () => {
  describe('MxCell Management Detail Component', () => {
    let comp: MxCellDetailComponent;
    let fixture: ComponentFixture<MxCellDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MxCellDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ mxCell: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MxCellDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MxCellDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load mxCell on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.mxCell).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
