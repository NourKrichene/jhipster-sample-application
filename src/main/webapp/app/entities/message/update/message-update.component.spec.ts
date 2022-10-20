import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MessageFormService } from './message-form.service';
import { MessageService } from '../service/message.service';
import { IMessage } from '../message.model';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';

import { MessageUpdateComponent } from './message-update.component';

describe('Message Management Update Component', () => {
  let comp: MessageUpdateComponent;
  let fixture: ComponentFixture<MessageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let messageFormService: MessageFormService;
  let messageService: MessageService;
  let collaboraterService: CollaboraterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MessageUpdateComponent],
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
      .overrideTemplate(MessageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MessageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    messageFormService = TestBed.inject(MessageFormService);
    messageService = TestBed.inject(MessageService);
    collaboraterService = TestBed.inject(CollaboraterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Collaborater query and add missing value', () => {
      const message: IMessage = { id: 456 };
      const from: ICollaborater = { id: 63728 };
      message.from = from;
      const too: ICollaborater = { id: 75829 };
      message.too = too;

      const collaboraterCollection: ICollaborater[] = [{ id: 48831 }];
      jest.spyOn(collaboraterService, 'query').mockReturnValue(of(new HttpResponse({ body: collaboraterCollection })));
      const additionalCollaboraters = [from, too];
      const expectedCollection: ICollaborater[] = [...additionalCollaboraters, ...collaboraterCollection];
      jest.spyOn(collaboraterService, 'addCollaboraterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ message });
      comp.ngOnInit();

      expect(collaboraterService.query).toHaveBeenCalled();
      expect(collaboraterService.addCollaboraterToCollectionIfMissing).toHaveBeenCalledWith(
        collaboraterCollection,
        ...additionalCollaboraters.map(expect.objectContaining)
      );
      expect(comp.collaboratersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const message: IMessage = { id: 456 };
      const from: ICollaborater = { id: 67698 };
      message.from = from;
      const too: ICollaborater = { id: 42116 };
      message.too = too;

      activatedRoute.data = of({ message });
      comp.ngOnInit();

      expect(comp.collaboratersSharedCollection).toContain(from);
      expect(comp.collaboratersSharedCollection).toContain(too);
      expect(comp.message).toEqual(message);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMessage>>();
      const message = { id: 123 };
      jest.spyOn(messageFormService, 'getMessage').mockReturnValue(message);
      jest.spyOn(messageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ message });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: message }));
      saveSubject.complete();

      // THEN
      expect(messageFormService.getMessage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(messageService.update).toHaveBeenCalledWith(expect.objectContaining(message));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMessage>>();
      const message = { id: 123 };
      jest.spyOn(messageFormService, 'getMessage').mockReturnValue({ id: null });
      jest.spyOn(messageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ message: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: message }));
      saveSubject.complete();

      // THEN
      expect(messageFormService.getMessage).toHaveBeenCalled();
      expect(messageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMessage>>();
      const message = { id: 123 };
      jest.spyOn(messageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ message });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(messageService.update).toHaveBeenCalled();
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
