import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 55962,
};

export const sampleWithPartialData: IProject = {
  id: 27695,
  status: Status['DONE'],
  name: 'Agent deposit',
  creationDate: dayjs('2022-10-19T14:40'),
  archived: false,
};

export const sampleWithFullData: IProject = {
  id: 77433,
  status: Status['NOT_DONE'],
  name: 'Communications Implemented dot-com',
  creationDate: dayjs('2022-10-19T22:06'),
  archived: false,
};

export const sampleWithNewData: NewProject = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
