import dayjs from 'dayjs/esm';
import { ICollaborater } from 'app/entities/collaborater/collaborater.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IProject {
  id: number;
  status?: Status | null;
  name?: string | null;
  creationDate?: dayjs.Dayjs | null;
  archived?: boolean | null;
  creator?: Pick<ICollaborater, 'id'> | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
