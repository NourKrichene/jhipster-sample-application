import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TaskFormService, TaskFormGroup } from './task-form.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { CollaboraterService } from 'app/entities/collaborater/service/collaborater.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;
  statusValues = Object.keys(Status);

  collaboratersSharedCollection: ICollaborater[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected collaboraterService: CollaboraterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCollaborater = (o1: ICollaborater | null, o2: ICollaborater | null): boolean =>
    this.collaboraterService.compareCollaborater(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.collaboratersSharedCollection = this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
      this.collaboratersSharedCollection,
      task.creator,
      ...(task.collaboraters ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.collaboraterService
      .query()
      .pipe(map((res: HttpResponse<ICollaborater[]>) => res.body ?? []))
      .pipe(
        map((collaboraters: ICollaborater[]) =>
          this.collaboraterService.addCollaboraterToCollectionIfMissing<ICollaborater>(
            collaboraters,
            this.task?.creator,
            ...(this.task?.collaboraters ?? [])
          )
        )
      )
      .subscribe((collaboraters: ICollaborater[]) => (this.collaboratersSharedCollection = collaboraters));
  }
}
