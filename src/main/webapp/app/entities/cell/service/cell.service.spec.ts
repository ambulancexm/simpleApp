import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICell, Cell } from '../cell.model';

import { CellService } from './cell.service';

describe('Service Tests', () => {
  describe('Cell Service', () => {
    let service: CellService;
    let httpMock: HttpTestingController;
    let elemDefault: ICell;
    let expectedResult: ICell | ICell[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CellService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        age: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Cell', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Cell()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cell', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            age: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cell', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            age: 1,
          },
          new Cell()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cell', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            age: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Cell', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCellToCollectionIfMissing', () => {
        it('should add a Cell to an empty array', () => {
          const cell: ICell = { id: 123 };
          expectedResult = service.addCellToCollectionIfMissing([], cell);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cell);
        });

        it('should not add a Cell to an array that contains it', () => {
          const cell: ICell = { id: 123 };
          const cellCollection: ICell[] = [
            {
              ...cell,
            },
            { id: 456 },
          ];
          expectedResult = service.addCellToCollectionIfMissing(cellCollection, cell);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cell to an array that doesn't contain it", () => {
          const cell: ICell = { id: 123 };
          const cellCollection: ICell[] = [{ id: 456 }];
          expectedResult = service.addCellToCollectionIfMissing(cellCollection, cell);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cell);
        });

        it('should add only unique Cell to an array', () => {
          const cellArray: ICell[] = [{ id: 123 }, { id: 456 }, { id: 26643 }];
          const cellCollection: ICell[] = [{ id: 123 }];
          expectedResult = service.addCellToCollectionIfMissing(cellCollection, ...cellArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cell: ICell = { id: 123 };
          const cell2: ICell = { id: 456 };
          expectedResult = service.addCellToCollectionIfMissing([], cell, cell2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cell);
          expect(expectedResult).toContain(cell2);
        });

        it('should accept null and undefined values', () => {
          const cell: ICell = { id: 123 };
          expectedResult = service.addCellToCollectionIfMissing([], null, cell, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cell);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
