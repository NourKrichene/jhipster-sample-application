import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CollaboraterFormService } from './collaborater-form.service';
import { CollaboraterService } from '../service/collaborater.service';
import { ICollaborater } from '../collaborater.model';

import { CollaboraterUpdateComponent } from './collaborater-update.component';

describe('Collaborater Management Update Component', () => {
  let comp: CollaboraterUpdateComponent;
  let fixture: ComponentFixture<CollaboraterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let collaboraterFormService: CollaboraterFormService;
  let collaboraterService: CollaboraterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CollaboraterUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CollaboraterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollaboraterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collaboraterFormService = TestBed.inject(CollaboraterFormService);
    collaboraterService = TestBed.inject(CollaboraterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Collaborater query and add missing value', () => {
      const collaborater: ICollaborater = { id: 456 };
      const creator: ICollaborater = { id: 35358 };
      collaborater.creator = creator;

      const collaboraterCollection: ICollaborater[] = [{ id: 6436 }];
      jest.spyOn(collaboraterService, 'query').mockReturnValue(of(new HttpResponse({ body: collaboraterCollection })));
      const additionalCollaboraters = [creator];
      const expectedCollection: ICollaborater[] = [...additionalCollaboraters, ...collaboraterCollection];
      jest.spyOn(collaboraterService, 'addCollaboraterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ collaborater });
      comp.ngOnInit();

      expect(collaboraterService.query).toHaveBeenCalled();
      expect(collaboraterService.addCollaboraterToCollectionIfMissing).toHaveBeenCalledWith(
        collaboraterCollection,
        ...additionalCollaboraters.map(expect.objectContaining)
      );
      expect(comp.collaboratersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const collaborater: ICollaborater = { id: 456 };
      const creator: ICollaborater = { id: 25644 };
      collaborater.creator = creator;

      activatedRoute.data = of({ collaborater });
      comp.ngOnInit();

      expect(comp.collaboratersSharedCollection).toContain(creator);
      expect(comp.collaborater).toEqual(collaborater);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaborater>>();
      const collaborater = { id: 123 };
      jest.spyOn(collaboraterFormService, 'getCollaborater').mockReturnValue(collaborater);
      jest.spyOn(collaboraterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaborater });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collaborater }));
      saveSubject.complete();

      // THEN
      expect(collaboraterFormService.getCollaborater).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(collaboraterService.update).toHaveBeenCalledWith(expect.objectContaining(collaborater));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaborater>>();
      const collaborater = { id: 123 };
      jest.spyOn(collaboraterFormService, 'getCollaborater').mockReturnValue({ id: null });
      jest.spyOn(collaboraterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaborater: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collaborater }));
      saveSubject.complete();

      // THEN
      expect(collaboraterFormService.getCollaborater).toHaveBeenCalled();
      expect(collaboraterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICollaborater>>();
      const collaborater = { id: 123 };
      jest.spyOn(collaboraterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collaborater });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(collaboraterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCollaborater', () => {
      it('Should forward to collaboraterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(collaboraterService, 'compareCollaborater');
        comp.compareCollaborater(entity, entity2);
        expect(collaboraterService.compareCollaborater).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
