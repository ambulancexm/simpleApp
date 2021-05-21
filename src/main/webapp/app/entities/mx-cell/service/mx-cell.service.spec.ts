import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMxCell, MxCell } from '../mx-cell.model';

import { MxCellService } from './mx-cell.service';

describe('Service Tests', () => {
  describe('MxCell Service', () => {
    let service: MxCellService;
    let httpMock: HttpTestingController;
    let elemDefault: IMxCell;
    let expectedResult: IMxCell | IMxCell[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MxCellService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        lg: 'AAAAAAA',
        style: 'AAAAAAA',
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

      it('should create a MxCell', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new MxCell()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MxCell', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            lg: 'BBBBBB',
            style: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a MxCell', () => {
        const patchObject = Object.assign(
          {
            lg: 'BBBBBB',
          },
          new MxCell()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of MxCell', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            lg: 'BBBBBB',
            style: 'BBBBBB',
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

      it('should delete a MxCell', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMxCellToCollectionIfMissing', () => {
        it('should add a MxCell to an empty array', () => {
          const mxCell: IMxCell = { id: 123 };
          expectedResult = service.addMxCellToCollectionIfMissing([], mxCell);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mxCell);
        });

        it('should not add a MxCell to an array that contains it', () => {
          const mxCell: IMxCell = { id: 123 };
          const mxCellCollection: IMxCell[] = [
            {
              ...mxCell,
            },
            { id: 456 },
          ];
          expectedResult = service.addMxCellToCollectionIfMissing(mxCellCollection, mxCell);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a MxCell to an array that doesn't contain it", () => {
          const mxCell: IMxCell = { id: 123 };
          const mxCellCollection: IMxCell[] = [{ id: 456 }];
          expectedResult = service.addMxCellToCollectionIfMissing(mxCellCollection, mxCell);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mxCell);
        });

        it('should add only unique MxCell to an array', () => {
          const mxCellArray: IMxCell[] = [{ id: 123 }, { id: 456 }, { id: 63703 }];
          const mxCellCollection: IMxCell[] = [{ id: 123 }];
          expectedResult = service.addMxCellToCollectionIfMissing(mxCellCollection, ...mxCellArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const mxCell: IMxCell = { id: 123 };
          const mxCell2: IMxCell = { id: 456 };
          expectedResult = service.addMxCellToCollectionIfMissing([], mxCell, mxCell2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(mxCell);
          expect(expectedResult).toContain(mxCell2);
        });

        it('should accept null and undefined values', () => {
          const mxCell: IMxCell = { id: 123 };
          expectedResult = service.addMxCellToCollectionIfMissing([], null, mxCell, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(mxCell);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
