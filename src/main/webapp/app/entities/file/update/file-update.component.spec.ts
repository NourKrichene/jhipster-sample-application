import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FileFormService } from './file-form.service';
import { FileService } from '../service/file.service';
import { IFile } from '../file.model';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';
import { IMessage } from 'app/entities/message/message.model';
import { MessageService } from 'app/entities/message/service/message.service';

import { FileUpdateComponent } from './file-update.component';

describe('File Management Update Component', () => {
  let comp: FileUpdateComponent;
  let fixture: ComponentFixture<FileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fileFormService: FileFormService;
  let fileService: FileService;
  let collaboraterService: CollaboraterService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FileUpdateComponent],
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
      .overrideTemplate(FileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fileFormService = TestBed.inject(FileFormService);
    fileService = TestBed.inject(FileService);
    collaboraterService = TestBed.inject(CollaboraterService);
    messageService = TestBed.inject(MessageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Collaborater query and add missing value', () => {
      const file: IFile = { id: 456 };
      const creator: ICollaborater = { id: 25830 };
      file.creator = creator;

      const collaboraterCollection: ICollaborater[] = [{ id: 70310 }];
      jest.spyOn(collaboraterService, 'query').mockReturnValue(of(new HttpResponse({ body: collaboraterCollection })));
      const additionalCollaboraters = [creator];
      const expectedCollection: ICollaborater[] = [...additionalCollaboraters, ...collaboraterCollection];
      jest.spyOn(collaboraterService, 'addCollaboraterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(collaboraterService.query).toHaveBeenCalled();
      expect(collaboraterService.addCollaboraterToCollectionIfMissing).toHaveBeenCalledWith(
        collaboraterCollection,
        ...additionalCollaboraters.map(expect.objectContaining)
      );
      expect(comp.collaboratersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Message query and add missing value', () => {
      const file: IFile = { id: 456 };
      const file: IMessage = { id: 36392 };
      file.file = file;

      const messageCollection: IMessage[] = [{ id: 68707 }];
      jest.spyOn(messageService, 'query').mockReturnValue(of(new HttpResponse({ body: messageCollection })));
      const additionalMessages = [file];
      const expectedCollection: IMessage[] = [...additionalMessages, ...messageCollection];
      jest.spyOn(messageService, 'addMessageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(messageService.query).toHaveBeenCalled();
      expect(messageService.addMessageToCollectionIfMissing).toHaveBeenCalledWith(
        messageCollection,
        ...additionalMessages.map(expect.objectContaining)
      );
      expect(comp.messagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const file: IFile = { id: 456 };
      const creator: ICollaborater = { id: 46168 };
      file.creator = creator;
      const file: IMessage = { id: 59118 };
      file.file = file;

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(comp.collaboratersSharedCollection).toContain(creator);
      expect(comp.messagesSharedCollection).toContain(file);
      expect(comp.file).toEqual(file);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFile>>();
      const file = { id: 123 };
      jest.spyOn(fileFormService, 'getFile').mockReturnValue(file);
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(fileFormService.getFile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fileService.update).toHaveBeenCalledWith(expect.objectContaining(file));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFile>>();
      const file = { id: 123 };
      jest.spyOn(fileFormService, 'getFile').mockReturnValue({ id: null });
      jest.spyOn(fileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(fileFormService.getFile).toHaveBeenCalled();
      expect(fileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFile>>();
      const file = { id: 123 };
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fileService.update).toHaveBeenCalled();
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

    describe('compareMessage', () => {
      it('Should forward to messageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(messageService, 'compareMessage');
        comp.compareMessage(entity, entity2);
        expect(messageService.compareMessage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
