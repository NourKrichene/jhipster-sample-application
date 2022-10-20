import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICollaborater } from '../collaborater.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../collaborater.test-samples';

import { CollaboraterService, RestCollaborater } from './collaborater.service';

const requireRestSample: RestCollaborater = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.toJSON(),
};

describe('Collaborater Service', () => {
  let service: CollaboraterService;
  let httpMock: HttpTestingController;
  let expectedResult: ICollaborater | ICollaborater[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CollaboraterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Collaborater', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const collaborater = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(collaborater).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Collaborater', () => {
      const collaborater = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(collaborater).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Collaborater', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Collaborater', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Collaborater', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCollaboraterToCollectionIfMissing', () => {
      it('should add a Collaborater to an empty array', () => {
        const collaborater: ICollaborater = sampleWithRequiredData;
        expectedResult = service.addCollaboraterToCollectionIfMissing([], collaborater);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collaborater);
      });

      it('should not add a Collaborater to an array that contains it', () => {
        const collaborater: ICollaborater = sampleWithRequiredData;
        const collaboraterCollection: ICollaborater[] = [
          {
            ...collaborater,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCollaboraterToCollectionIfMissing(collaboraterCollection, collaborater);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Collaborater to an array that doesn't contain it", () => {
        const collaborater: ICollaborater = sampleWithRequiredData;
        const collaboraterCollection: ICollaborater[] = [sampleWithPartialData];
        expectedResult = service.addCollaboraterToCollectionIfMissing(collaboraterCollection, collaborater);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collaborater);
      });

      it('should add only unique Collaborater to an array', () => {
        const collaboraterArray: ICollaborater[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const collaboraterCollection: ICollaborater[] = [sampleWithRequiredData];
        expectedResult = service.addCollaboraterToCollectionIfMissing(collaboraterCollection, ...collaboraterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const collaborater: ICollaborater = sampleWithRequiredData;
        const collaborater2: ICollaborater = sampleWithPartialData;
        expectedResult = service.addCollaboraterToCollectionIfMissing([], collaborater, collaborater2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collaborater);
        expect(expectedResult).toContain(collaborater2);
      });

      it('should accept null and undefined values', () => {
        const collaborater: ICollaborater = sampleWithRequiredData;
        expectedResult = service.addCollaboraterToCollectionIfMissing([], null, collaborater, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collaborater);
      });

      it('should return initial array if no Collaborater is added', () => {
        const collaboraterCollection: ICollaborater[] = [sampleWithRequiredData];
        expectedResult = service.addCollaboraterToCollectionIfMissing(collaboraterCollection, undefined, null);
        expect(expectedResult).toEqual(collaboraterCollection);
      });
    });

    describe('compareCollaborater', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCollaborater(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCollaborater(entity1, entity2);
        const compareResult2 = service.compareCollaborater(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCollaborater(entity1, entity2);
        const compareResult2 = service.compareCollaborater(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCollaborater(entity1, entity2);
        const compareResult2 = service.compareCollaborater(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
