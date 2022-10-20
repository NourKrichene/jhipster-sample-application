import dayjs from 'dayjs/esm';

import { ICollaborater, NewCollaborater } from './collaborater.model';

export const sampleWithRequiredData: ICollaborater = {
  id: 86065,
};

export const sampleWithPartialData: ICollaborater = {
  id: 21860,
  creationDate: dayjs('2022-10-19T12:03'),
  archived: false,
};

export const sampleWithFullData: ICollaborater = {
  id: 5780,
  name: 'Guinea',
  creationDate: dayjs('2022-10-20T02:21'),
  archived: false,
};

export const sampleWithNewData: NewCollaborater = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
