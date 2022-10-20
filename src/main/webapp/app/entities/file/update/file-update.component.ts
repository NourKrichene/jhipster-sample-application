import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FileFormService, FileFormGroup } from './file-form.service';
import { IFile } from '../file.model';
import { FileService } from '../service/file.service';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';
import { IMessage } from 'app/entities/message/message.model';
import { MessageService } from 'app/entities/message/service/message.service';

@Component({
  selector: 'jhi-file-update',
  templateUrl: './file-update.component.html',
})
export class FileUpdateComponent implements OnInit {
  isSaving = false;
  file: IFile | null = null;

  collaboratersSharedCollection: ICollaborater[] = [];
  messagesSharedCollection: IMessage[] = [];

  editForm: FileFormGroup = this.fileFormService.createFileFormGroup();

  constructor(
    protected fileService: FileService,
    protected fileFormService: FileFormService,
    protected collaboraterService: CollaboraterService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCollaborater = (o1: ICollaborater | null, o2: ICollaborater | null): boolean =>
    this.collaboraterService.compareCollaborater(o1, o2);

  compareMessage = (o1: IMessage | null, o2: IMessage | null): boolean => this.messageService.compareMessage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.file = file;
      if (file) {
        this.updateForm(file);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.fileFormService.getFile(this.editForm);
    if (file.id !== null) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(file: IFile): void {
    this.file = file;
    this.fileFormService.resetForm(this.editForm, file);

    this.collaboratersSharedCollection = this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
      this.collaboratersSharedCollection,
      file.creator
    );
    this.messagesSharedCollection = this.messageService.addMessageToCollectionIfMissing<IMessage>(this.messagesSharedCollection, file.file);
  }

  protected loadRelationshipsOptions(): void {
    this.collaboraterService
      .query()
      .pipe(map((res: HttpResponse<ICollaborater[]>) => res.body ?? []))
      .pipe(
        map((collaboraters: ICollaborater[]) =>
          this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(collaboraters, this.file?.creator)
        )
      )
      .subscribe((collaboraters: ICollaborater[]) => (this.collaboratersSharedCollection = collaboraters));

    this.messageService
      .query()
      .pipe(map((res: HttpResponse<IMessage[]>) => res.body ?? []))
      .pipe(map((messages: IMessage[]) => this.messageService.addMessageToCollectionIfMissing<IMessage>(messages, this.file?.file)))
      .subscribe((messages: IMessage[]) => (this.messagesSharedCollection = messages));
  }
}
