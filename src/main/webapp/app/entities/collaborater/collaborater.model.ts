import dayjs from 'dayjs/esm';
import { ITask } from 'app/entities/task/task.model';

export interface ICollaborater {
  id: number;
  name?: string | null;
  creationDate?: dayjs.Dayjs | null;
  archived?: boolean | null;
  creator?: Pick<ICollaborater, 'id'> | null;
  tasks?: Pick<ITask, 'id'>[] | null;
}

export type NewCollaborater = Omit<ICollaborater, 'id'> & { id: null };
