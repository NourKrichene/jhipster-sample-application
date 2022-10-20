import dayjs from 'dayjs/esm';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { IMessage } from 'app/entities/message/message.model';

export interface IFile {
  id: number;
  name?: string | null;
  creationDate?: dayjs.Dayjs | null;
  archived?: boolean | null;
  path?: string | null;
  creator?: Pick<ICollaborater, 'id'> | null;
  file?: Pick<IMessage, 'id'> | null;
}

export type NewFile = Omit<IFile, 'id'> & { id: null };
