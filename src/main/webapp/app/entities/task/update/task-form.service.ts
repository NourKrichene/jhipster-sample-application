import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITask | NewTask> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

type TaskFormRawValue = FormValueOf<ITask>;

type NewTaskFormRawValue = FormValueOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id' | 'creationDate' | 'archived' | 'collaboraters'>;

type TaskFormGroupContent = {
  id: FormControl<TaskFormRawValue['id'] | NewTask['id']>;
  status: FormControl<TaskFormRawValue['status']>;
  name: FormControl<TaskFormRawValue['name']>;
  creationDate: FormControl<TaskFormRawValue['creationDate']>;
  archived: FormControl<TaskFormRawValue['archived']>;
  creator: FormControl<TaskFormRawValue['creator']>;
  collaboraters: FormControl<TaskFormRawValue['collaboraters']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = { id: null }): TaskFormGroup {
    const taskRawValue = this.convertTaskToTaskRawValue({
      ...this.getFormDefaults(),
      ...task,
    });
    return new FormGroup<TaskFormGroupContent>({
      id: new FormControl(
        { value: taskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      status: new FormControl(taskRawValue.status),
      name: new FormControl(taskRawValue.name),
      creationDate: new FormControl(taskRawValue.creationDate),
      archived: new FormControl(taskRawValue.archived),
      creator: new FormControl(taskRawValue.creator),
      collaboraters: new FormControl(taskRawValue.collaboraters ?? []),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return this.convertTaskRawValueToTask(form.getRawValue() as TaskFormRawValue | NewTaskFormRawValue);
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = this.convertTaskToTaskRawValue({ ...this.getFormDefaults(), ...task });
    form.reset(
      {
        ...taskRawValue,
        id: { value: taskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
      archived: false,
      collaboraters: [],
    };
  }

  private convertTaskRawValueToTask(rawTask: TaskFormRawValue | NewTaskFormRawValue): ITask | NewTask {
    return {
      ...rawTask,
      creationDate: dayjs(rawTask.creationDate, DATE_TIME_FORMAT),
    };
  }

  private convertTaskToTaskRawValue(
    task: ITask | (Partial<NewTask> & TaskFormDefaults)
  ): TaskFormRawValue | PartialWithRequiredKeyOf<NewTaskFormRawValue> {
    return {
      ...task,
      creationDate: task.creationDate ? task.creationDate.format(DATE_TIME_FORMAT) : undefined,
      collaboraters: task.collaboraters ?? [],
    };
  }
}
