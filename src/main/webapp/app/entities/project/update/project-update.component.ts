import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProjectFormService, ProjectFormGroup } from './project-form.service';
import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;
  project: IProject | null = null;
  statusValues = Object.keys(Status);

  collaboratersSharedCollection: ICollaborater[] = [];

  editForm: ProjectFormGroup = this.projectFormService.createProjectFormGroup();

  constructor(
    protected projectService: ProjectService,
    protected projectFormService: ProjectFormService,
    protected collaboraterService: CollaboraterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCollaborater = (o1: ICollaborater | null, o2: ICollaborater | null): boolean =>
    this.collaboraterService.compareCollaborater(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (project) {
        this.updateForm(project);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.projectFormService.getProject(this.editForm);
    if (project.id !== null) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  protected updateForm(project: IProject): void {
    this.project = project;
    this.projectFormService.resetForm(this.editForm, project);

    this.collaboratersSharedCollection = this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
      this.collaboratersSharedCollection,
      project.creator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.collaboraterService
      .query()
      .pipe(map((res: HttpResponse<ICollaborater[]>) => res.body ?? []))
      .pipe(
        map((collaboraters: ICollaborater[]) =>
          this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(collaboraters, this.project?.creator)
        )
      )
      .subscribe((collaboraters: ICollaborater[]) => (this.collaboratersSharedCollection = collaboraters));
  }
}
