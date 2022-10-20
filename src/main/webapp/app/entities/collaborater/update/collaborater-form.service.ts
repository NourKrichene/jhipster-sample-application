import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICollaborater, NewCollaborater } from '../collaborater.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICollaborater for edit and NewCollaboraterFormGroupInput for create.
 */
type CollaboraterFormGroupInput = ICollaborater | PartialWithRequiredKeyOf<NewCollaborater>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICollaborater | NewCollaborater> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

type CollaboraterFormRawValue = FormValueOf<ICollaborater>;

type NewCollaboraterFormRawValue = FormValueOf<NewCollaborater>;

type CollaboraterFormDefaults = Pick<NewCollaborater, 'id' | 'creationDate' | 'archived' | 'tasks'>;

type CollaboraterFormGroupContent = {
  id: FormControl<CollaboraterFormRawValue['id'] | NewCollaborater['id']>;
  name: FormControl<CollaboraterFormRawValue['name']>;
  creationDate: FormControl<CollaboraterFormRawValue['creationDate']>;
  archived: FormControl<CollaboraterFormRawValue['archived']>;
  creator: FormControl<CollaboraterFormRawValue['creator']>;
  tasks: FormControl<CollaboraterFormRawValue['tasks']>;
};

export type CollaboraterFormGroup = FormGroup<CollaboraterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CollaboraterFormService {
  createCollaboraterFormGroup(collaborater: CollaboraterFormGroupInput = { id: null }): CollaboraterFormGroup {
    const collaboraterRawValue = this.convertCollaboraterToCollaboraterRawValue({
      ...this.getFormDefaults(),
      ...collaborater,
    });
    return new FormGroup<CollaboraterFormGroupContent>({
      id: new FormControl(
        { value: collaboraterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(collaboraterRawValue.name),
      creationDate: new FormControl(collaboraterRawValue.creationDate),
      archived: new FormControl(collaboraterRawValue.archived),
      creator: new FormControl(collaboraterRawValue.creator),
      tasks: new FormControl(collaboraterRawValue.tasks ?? []),
    });
  }

  getCollaborater(form: CollaboraterFormGroup): ICollaborater | NewCollaborater {
    return this.convertCollaboraterRawValueToCollaborater(form.getRawValue() as CollaboraterFormRawValue | NewCollaboraterFormRawValue);
  }

  resetForm(form: CollaboraterFormGroup, collaborater: CollaboraterFormGroupInput): void {
    const collaboraterRawValue = this.convertCollaboraterToCollaboraterRawValue({ ...this.getFormDefaults(), ...collaborater });
    form.reset(
      {
        ...collaboraterRawValue,
        id: { value: collaboraterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CollaboraterFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
      archived: false,
      tasks: [],
    };
  }

  private convertCollaboraterRawValueToCollaborater(
    rawCollaborater: CollaboraterFormRawValue | NewCollaboraterFormRawValue
  ): ICollaborater | NewCollaborater {
    return {
      ...rawCollaborater,
      creationDate: dayjs(rawCollaborater.creationDate, DATE_TIME_FORMAT),
    };
  }

  private convertCollaboraterToCollaboraterRawValue(
    collaborater: ICollaborater | (Partial<NewCollaborater> & CollaboraterFormDefaults)
  ): CollaboraterFormRawValue | PartialWithRequiredKeyOf<NewCollaboraterFormRawValue> {
    return {
      ...collaborater,
      creationDate: collaborater.creationDate ? collaborater.creationDate.format(DATE_TIME_FORMAT) : undefined,
      tasks: collaborater.tasks ?? [],
    };
  }
}
