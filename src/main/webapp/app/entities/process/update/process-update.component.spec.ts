jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProcessService } from '../service/process.service';
import { IProcess, Process } from '../process.model';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

import { ProcessUpdateComponent } from './process-update.component';

describe('Component Tests', () => {
  describe('Process Management Update Component', () => {
    let comp: ProcessUpdateComponent;
    let fixture: ComponentFixture<ProcessUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let processService: ProcessService;
    let mxCellService: MxCellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProcessUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProcessUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProcessUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      processService = TestBed.inject(ProcessService);
      mxCellService = TestBed.inject(MxCellService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call MxCell query and add missing value', () => {
        const process: IProcess = { id: 456 };
        const mxCell: IMxCell = { id: 91118 };
        process.mxCell = mxCell;

        const mxCellCollection: IMxCell[] = [{ id: 11022 }];
        spyOn(mxCellService, 'query').and.returnValue(of(new HttpResponse({ body: mxCellCollection })));
        const additionalMxCells = [mxCell];
        const expectedCollection: IMxCell[] = [...additionalMxCells, ...mxCellCollection];
        spyOn(mxCellService, 'addMxCellToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ process });
        comp.ngOnInit();

        expect(mxCellService.query).toHaveBeenCalled();
        expect(mxCellService.addMxCellToCollectionIfMissing).toHaveBeenCalledWith(mxCellCollection, ...additionalMxCells);
        expect(comp.mxCellsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const process: IProcess = { id: 456 };
        const mxCell: IMxCell = { id: 71418 };
        process.mxCell = mxCell;

        activatedRoute.data = of({ process });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(process));
        expect(comp.mxCellsSharedCollection).toContain(mxCell);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const process = { id: 123 };
        spyOn(processService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ process });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: process }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(processService.update).toHaveBeenCalledWith(process);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const process = new Process();
        spyOn(processService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ process });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: process }));
        saveSubject.complete();

        // THEN
        expect(processService.create).toHaveBeenCalledWith(process);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const process = { id: 123 };
        spyOn(processService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ process });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(processService.update).toHaveBeenCalledWith(process);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMxCellById', () => {
        it('Should return tracked MxCell primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMxCellById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
