import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
};

export const sampleWithPartialData: ITask = {
  id: 61703,
  status: Status['IN_PROGRESS'],
  name: 'Up-sized Cheese Representative',
};

export const sampleWithFullData: ITask = {
  id: 50690,
  status: Status['DONE'],
  name: 'Jewelery functionalities Virginia',
  creationDate: dayjs('2022-10-19T12:31'),
  archived: true,
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
