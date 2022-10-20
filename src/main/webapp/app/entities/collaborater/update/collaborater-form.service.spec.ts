import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../collaborater.test-samples';

import { CollaboraterFormService } from './collaborater-form.service';

describe('Collaborater Form Service', () => {
  let service: CollaboraterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboraterFormService);
  });

  describe('Service methods', () => {
    describe('createCollaboraterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCollaboraterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creationDate: expect.any(Object),
            archived: expect.any(Object),
            creator: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });

      it('passing ICollaborater should create a new form with FormGroup', () => {
        const formGroup = service.createCollaboraterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creationDate: expect.any(Object),
            archived: expect.any(Object),
            creator: expect.any(Object),
            tasks: expect.any(Object),
          })
        );
      });
    });

    describe('getCollaborater', () => {
      it('should return NewCollaborater for default Collaborater initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCollaboraterFormGroup(sampleWithNewData);

        const collaborater = service.getCollaborater(formGroup) as any;

        expect(collaborater).toMatchObject(sampleWithNewData);
      });

      it('should return NewCollaborater for empty Collaborater initial value', () => {
        const formGroup = service.createCollaboraterFormGroup();

        const collaborater = service.getCollaborater(formGroup) as any;

        expect(collaborater).toMatchObject({});
      });

      it('should return ICollaborater', () => {
        const formGroup = service.createCollaboraterFormGroup(sampleWithRequiredData);

        const collaborater = service.getCollaborater(formGroup) as any;

        expect(collaborater).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICollaborater should not enable id FormControl', () => {
        const formGroup = service.createCollaboraterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCollaborater should disable id FormControl', () => {
        const formGroup = service.createCollaboraterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
