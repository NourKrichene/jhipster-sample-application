import dayjs from 'dayjs/esm';

import { IFile, NewFile } from './file.model';

export const sampleWithRequiredData: IFile = {
  id: 35927,
};

export const sampleWithPartialData: IFile = {
  id: 42553,
  archived: false,
};

export const sampleWithFullData: IFile = {
  id: 41025,
  name: 'interface Producer XML',
  creationDate: dayjs('2022-10-20T05:47'),
  archived: true,
  path: 'Salvador',
};

export const sampleWithNewData: NewFile = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
