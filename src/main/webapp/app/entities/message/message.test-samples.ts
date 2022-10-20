import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
};

export const sampleWithPartialData: IMessage = {
  id: 28491,
  status: Status['DONE'],
  sentDate: dayjs('2022-10-19T20:09'),
  reaad: true,
};

export const sampleWithFullData: IMessage = {
  id: 94765,
  status: Status['NOT_DONE'],
  text: 'hack Global Louisiana',
  sentDate: dayjs('2022-10-19T20:07'),
  archived: false,
  reaad: false,
};

export const sampleWithNewData: NewMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
