import dayjs from 'dayjs/esm';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IMessage {
  id: number;
  status?: Status | null;
  text?: string | null;
  sentDate?: dayjs.Dayjs | null;
  archived?: boolean | null;
  reaad?: boolean | null;
  from?: Pick<ICollaborater, 'id'> | null;
  too?: Pick<ICollaborater, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
