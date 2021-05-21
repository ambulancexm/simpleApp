jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MxCellService } from '../service/mx-cell.service';
import { IMxCell, MxCell } from '../mx-cell.model';

import { MxCellUpdateComponent } from './mx-cell-update.component';

describe('Component Tests', () => {
  describe('MxCell Management Update Component', () => {
    let comp: MxCellUpdateComponent;
    let fixture: ComponentFixture<MxCellUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mxCellService: MxCellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MxCellUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MxCellUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MxCellUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mxCellService = TestBed.inject(MxCellService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const mxCell: IMxCell = { id: 456 };

        activatedRoute.data = of({ mxCell });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(mxCell));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mxCell = { id: 123 };
        spyOn(mxCellService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mxCell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mxCell }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mxCellService.update).toHaveBeenCalledWith(mxCell);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mxCell = new MxCell();
        spyOn(mxCellService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mxCell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: mxCell }));
        saveSubject.complete();

        // THEN
        expect(mxCellService.create).toHaveBeenCalledWith(mxCell);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const mxCell = { id: 123 };
        spyOn(mxCellService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ mxCell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mxCellService.update).toHaveBeenCalledWith(mxCell);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
