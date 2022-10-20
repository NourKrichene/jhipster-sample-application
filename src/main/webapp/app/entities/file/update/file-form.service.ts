import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFile, NewFile } from '../file.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFile for edit and NewFileFormGroupInput for create.
 */
type FileFormGroupInput = IFile | PartialWithRequiredKeyOf<NewFile>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFile | NewFile> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

type FileFormRawValue = FormValueOf<IFile>;

type NewFileFormRawValue = FormValueOf<NewFile>;

type FileFormDefaults = Pick<NewFile, 'id' | 'creationDate' | 'archived'>;

type FileFormGroupContent = {
  id: FormControl<FileFormRawValue['id'] | NewFile['id']>;
  name: FormControl<FileFormRawValue['name']>;
  creationDate: FormControl<FileFormRawValue['creationDate']>;
  archived: FormControl<FileFormRawValue['archived']>;
  path: FormControl<FileFormRawValue['path']>;
  creator: FormControl<FileFormRawValue['creator']>;
  file: FormControl<FileFormRawValue['file']>;
};

export type FileFormGroup = FormGroup<FileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FileFormService {
  createFileFormGroup(file: FileFormGroupInput = { id: null }): FileFormGroup {
    const fileRawValue = this.convertFileToFileRawValue({
      ...this.getFormDefaults(),
      ...file,
    });
    return new FormGroup<FileFormGroupContent>({
      id: new FormControl(
        { value: fileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(fileRawValue.name),
      creationDate: new FormControl(fileRawValue.creationDate),
      archived: new FormControl(fileRawValue.archived),
      path: new FormControl(fileRawValue.path),
      creator: new FormControl(fileRawValue.creator),
      file: new FormControl(fileRawValue.file),
    });
  }

  getFile(form: FileFormGroup): IFile | NewFile {
    return this.convertFileRawValueToFile(form.getRawValue() as FileFormRawValue | NewFileFormRawValue);
  }

  resetForm(form: FileFormGroup, file: FileFormGroupInput): void {
    const fileRawValue = this.convertFileToFileRawValue({ ...this.getFormDefaults(), ...file });
    form.reset(
      {
        ...fileRawValue,
        id: { value: fileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FileFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationDate: currentTime,
      archived: false,
    };
  }

  private convertFileRawValueToFile(rawFile: FileFormRawValue | NewFileFormRawValue): IFile | NewFile {
    return {
      ...rawFile,
      creationDate: dayjs(rawFile.creationDate, DATE_TIME_FORMAT),
    };
  }

  private convertFileToFileRawValue(
    file: IFile | (Partial<NewFile> & FileFormDefaults)
  ): FileFormRawValue | PartialWithRequiredKeyOf<NewFileFormRawValue> {
    return {
      ...file,
      creationDate: file.creationDate ? file.creationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
