jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMxCell, MxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';

import { MxCellRoutingResolveService } from './mx-cell-routing-resolve.service';

describe('Service Tests', () => {
  describe('MxCell routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MxCellRoutingResolveService;
    let service: MxCellService;
    let resultMxCell: IMxCell | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MxCellRoutingResolveService);
      service = TestBed.inject(MxCellService);
      resultMxCell = undefined;
    });

    describe('resolve', () => {
      it('should return IMxCell returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMxCell = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMxCell).toEqual({ id: 123 });
      });

      it('should return new IMxCell if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMxCell = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMxCell).toEqual(new MxCell());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMxCell = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMxCell).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
