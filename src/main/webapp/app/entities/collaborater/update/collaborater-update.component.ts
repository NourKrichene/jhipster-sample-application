import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CollaboraterFormService, CollaboraterFormGroup } from './collaborater-form.service';
import { ICollaborater } from '../collaborater.model';
import { CollaboraterService } from '../service/collaborater.service';

@Component({
  selector: 'jhi-collaborater-update',
  templateUrl: './collaborater-update.component.html',
})
export class CollaboraterUpdateComponent implements OnInit {
  isSaving = false;
  collaborater: ICollaborater | null = null;

  collaboratersSharedCollection: ICollaborater[] = [];

  editForm: CollaboraterFormGroup = this.collaboraterFormService.createCollaboraterFormGroup();

  constructor(
    protected collaboraterService: CollaboraterService,
    protected collaboraterFormService: CollaboraterFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCollaborater = (o1: ICollaborater | null, o2: ICollaborater | null): boolean =>
    this.collaboraterService.compareCollaborater(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collaborater }) => {
      this.collaborater = collaborater;
      if (collaborater) {
        this.updateForm(collaborater);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collaborater = this.collaboraterFormService.getCollaborater(this.editForm);
    if (collaborater.id !== null) {
      this.subscribeToSaveResponse(this.collaboraterService.update(collaborater));
    } else {
      this.subscribeToSaveResponse(this.collaboraterService.create(collaborater));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollaborater>>): void {
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

  protected updateForm(collaborater: ICollaborater): void {
    this.collaborater = collaborater;
    this.collaboraterFormService.resetForm(this.editForm, collaborater);

    this.collaboratersSharedCollection = this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
      this.collaboratersSharedCollection,
      collaborater.creator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.collaboraterService
      .query()
      .pipe(map((res: HttpResponse<ICollaborater[]>) => res.body ?? []))
      .pipe(
        map((collaboraters: ICollaborater[]) =>
          this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(collaboraters, this.collaborater?.creator)
        )
      )
      .subscribe((collaboraters: ICollaborater[]) => (this.collaboratersSharedCollection = collaboraters));
  }
}
