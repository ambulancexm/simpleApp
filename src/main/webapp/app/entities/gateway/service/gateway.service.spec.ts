import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGateway, Gateway } from '../gateway.model';

import { GatewayService } from './gateway.service';

describe('Service Tests', () => {
  describe('Gateway Service', () => {
    let service: GatewayService;
    let httpMock: HttpTestingController;
    let elemDefault: IGateway;
    let expectedResult: IGateway | IGateway[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GatewayService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
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

      it('should create a Gateway', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Gateway()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Gateway', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Gateway', () => {
        const patchObject = Object.assign({}, new Gateway());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Gateway', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a Gateway', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGatewayToCollectionIfMissing', () => {
        it('should add a Gateway to an empty array', () => {
          const gateway: IGateway = { id: 123 };
          expectedResult = service.addGatewayToCollectionIfMissing([], gateway);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(gateway);
        });

        it('should not add a Gateway to an array that contains it', () => {
          const gateway: IGateway = { id: 123 };
          const gatewayCollection: IGateway[] = [
            {
              ...gateway,
            },
            { id: 456 },
          ];
          expectedResult = service.addGatewayToCollectionIfMissing(gatewayCollection, gateway);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Gateway to an array that doesn't contain it", () => {
          const gateway: IGateway = { id: 123 };
          const gatewayCollection: IGateway[] = [{ id: 456 }];
          expectedResult = service.addGatewayToCollectionIfMissing(gatewayCollection, gateway);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(gateway);
        });

        it('should add only unique Gateway to an array', () => {
          const gatewayArray: IGateway[] = [{ id: 123 }, { id: 456 }, { id: 69556 }];
          const gatewayCollection: IGateway[] = [{ id: 123 }];
          expectedResult = service.addGatewayToCollectionIfMissing(gatewayCollection, ...gatewayArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const gateway: IGateway = { id: 123 };
          const gateway2: IGateway = { id: 456 };
          expectedResult = service.addGatewayToCollectionIfMissing([], gateway, gateway2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(gateway);
          expect(expectedResult).toContain(gateway2);
        });

        it('should accept null and undefined values', () => {
          const gateway: IGateway = { id: 123 };
          expectedResult = service.addGatewayToCollectionIfMissing([], null, gateway, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(gateway);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
