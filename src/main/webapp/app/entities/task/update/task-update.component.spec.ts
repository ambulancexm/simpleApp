jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask, Task } from '../task.model';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Component Tests', () => {
  describe('Task Management Update Component', () => {
    let comp: TaskUpdateComponent;
    let fixture: ComponentFixture<TaskUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let taskService: TaskService;
    let mxCellService: MxCellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TaskUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TaskUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      taskService = TestBed.inject(TaskService);
      mxCellService = TestBed.inject(MxCellService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call MxCell query and add missing value', () => {
        const task: ITask = { id: 456 };
        const mxCell: IMxCell = { id: 90186 };
        task.mxCell = mxCell;

        const mxCellCollection: IMxCell[] = [{ id: 16427 }];
        spyOn(mxCellService, 'query').and.returnValue(of(new HttpResponse({ body: mxCellCollection })));
        const additionalMxCells = [mxCell];
        const expectedCollection: IMxCell[] = [...additionalMxCells, ...mxCellCollection];
        spyOn(mxCellService, 'addMxCellToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(mxCellService.query).toHaveBeenCalled();
        expect(mxCellService.addMxCellToCollectionIfMissing).toHaveBeenCalledWith(mxCellCollection, ...additionalMxCells);
        expect(comp.mxCellsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const task: ITask = { id: 456 };
        const mxCell: IMxCell = { id: 73232 };
        task.mxCell = mxCell;

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(task));
        expect(comp.mxCellsSharedCollection).toContain(mxCell);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const task = { id: 123 };
        spyOn(taskService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const task = new Task();
        spyOn(taskService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(taskService.create).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const task = { id: 123 };
        spyOn(taskService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(taskService.update).toHaveBeenCalledWith(task);
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
