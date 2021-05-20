jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CellService } from '../service/cell.service';
import { ICell, Cell } from '../cell.model';

import { CellUpdateComponent } from './cell-update.component';

describe('Component Tests', () => {
  describe('Cell Management Update Component', () => {
    let comp: CellUpdateComponent;
    let fixture: ComponentFixture<CellUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cellService: CellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CellUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CellUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CellUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cellService = TestBed.inject(CellService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const cell: ICell = { id: 456 };

        activatedRoute.data = of({ cell });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cell));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cell = { id: 123 };
        spyOn(cellService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cell }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cellService.update).toHaveBeenCalledWith(cell);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cell = new Cell();
        spyOn(cellService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cell }));
        saveSubject.complete();

        // THEN
        expect(cellService.create).toHaveBeenCalledWith(cell);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cell = { id: 123 };
        spyOn(cellService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cell });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cellService.update).toHaveBeenCalledWith(cell);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
