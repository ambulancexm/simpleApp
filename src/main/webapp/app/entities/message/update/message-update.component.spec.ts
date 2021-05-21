jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MessageService } from '../service/message.service';
import { IMessage, Message } from '../message.model';
import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';
import { MxCellService } from 'app/entities/mx-cell/service/mx-cell.service';

import { MessageUpdateComponent } from './message-update.component';

describe('Component Tests', () => {
  describe('Message Management Update Component', () => {
    let comp: MessageUpdateComponent;
    let fixture: ComponentFixture<MessageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let messageService: MessageService;
    let mxCellService: MxCellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MessageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MessageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      messageService = TestBed.inject(MessageService);
      mxCellService = TestBed.inject(MxCellService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call MxCell query and add missing value', () => {
        const message: IMessage = { id: 456 };
        const mxCell: IMxCell = { id: 10196 };
        message.mxCell = mxCell;

        const mxCellCollection: IMxCell[] = [{ id: 16216 }];
        spyOn(mxCellService, 'query').and.returnValue(of(new HttpResponse({ body: mxCellCollection })));
        const additionalMxCells = [mxCell];
        const expectedCollection: IMxCell[] = [...additionalMxCells, ...mxCellCollection];
        spyOn(mxCellService, 'addMxCellToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(mxCellService.query).toHaveBeenCalled();
        expect(mxCellService.addMxCellToCollectionIfMissing).toHaveBeenCalledWith(mxCellCollection, ...additionalMxCells);
        expect(comp.mxCellsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const message: IMessage = { id: 456 };
        const mxCell: IMxCell = { id: 35010 };
        message.mxCell = mxCell;

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(message));
        expect(comp.mxCellsSharedCollection).toContain(mxCell);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = { id: 123 };
        spyOn(messageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(messageService.update).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = new Message();
        spyOn(messageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(messageService.create).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = { id: 123 };
        spyOn(messageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(messageService.update).toHaveBeenCalledWith(message);
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
