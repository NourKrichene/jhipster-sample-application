import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MessageFormService, MessageFormGroup } from './message-form.service';
import { IMessage } from '../message.model';
import { MessageService } from '../service/message.service';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;
  message: IMessage | null = null;
  statusValues = Object.keys(Status);

  collaboratersSharedCollection: ICollaborater[] = [];

  editForm: MessageFormGroup = this.messageFormService.createMessageFormGroup();

  constructor(
    protected messageService: MessageService,
    protected messageFormService: MessageFormService,
    protected collaboraterService: CollaboraterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCollaborater = (o1: ICollaborater | null, o2: ICollaborater | null): boolean =>
    this.collaboraterService.compareCollaborater(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.message = message;
      if (message) {
        this.updateForm(message);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.messageFormService.getMessage(this.editForm);
    if (message.id !== null) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
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

  protected updateForm(message: IMessage): void {
    this.message = message;
    this.messageFormService.resetForm(this.editForm, message);

    this.collaboratersSharedCollection = this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
      this.collaboratersSharedCollection,
      message.from,
      message.too
    );
  }

  protected loadRelationshipsOptions(): void {
    this.collaboraterService
      .query()
      .pipe(map((res: HttpResponse<ICollaborater[]>) => res.body ?? []))
      .pipe(
        map((collaboraters: ICollaborater[]) =>
          this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(collaboraters, this.message?.from, this.message?.too)
        )
      )
      .subscribe((collaboraters: ICollaborater[]) => (this.collaboratersSharedCollection = collaboraters));
  }
}
