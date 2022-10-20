import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFile, NewFile } from '../file.model';

export type PartialUpdateFile = Partial<IFile> & Pick<IFile, 'id'>;

type RestOf<T extends IFile | NewFile> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestFile = RestOf<IFile>;

export type NewRestFile = RestOf<NewFile>;

export type PartialUpdateRestFile = RestOf<PartialUpdateFile>;

export type EntityResponseType = HttpResponse<IFile>;
export type EntityArrayResponseType = HttpResponse<IFile[]>;

@Injectable({ providedIn: 'root' })
export class FileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(file: NewFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http.post<RestFile>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(file: IFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http
      .put<RestFile>(`${this.resourceUrl}/${this.getFileIdentifier(file)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(file: PartialUpdateFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http
      .patch<RestFile>(`${this.resourceUrl}/${this.getFileIdentifier(file)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFile>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFile[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFileIdentifier(file: Pick<IFile, 'id'>): number {
    return file.id;
  }

  compareFile(o1: Pick<IFile, 'id'> | null, o2: Pick<IFile, 'id'> | null): boolean {
    return o1 && o2 ? this.getFileIdentifier(o1) === this.getFileIdentifier(o2) : o1 === o2;
  }

  addFileToCollectionIfMissing<Type extends Pick<IFile, 'id'>>(
    fileCollection: Type[],
    ...filesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const files: Type[] = filesToCheck.filter(isPresent);
    if (files.length > 0) {
      const fileCollectionIdentifiers = fileCollection.map(fileItem => this.getFileIdentifier(fileItem)!);
      const filesToAdd = files.filter(fileItem => {
        const fileIdentifier = this.getFileIdentifier(fileItem);
        if (fileCollectionIdentifiers.includes(fileIdentifier)) {
          return false;
        }
        fileCollectionIdentifiers.push(fileIdentifier);
        return true;
      });
      return [...filesToAdd, ...fileCollection];
    }
    return fileCollection;
  }

  protected convertDateFromClient<T extends IFile | NewFile | PartialUpdateFile>(file: T): RestOf<T> {
    return {
      ...file,
      creationDate: file.creationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFile: RestFile): IFile {
    return {
      ...restFile,
      creationDate: restFile.creationDate ? dayjs(restFile.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFile>): HttpResponse<IFile> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFile[]>): HttpResponse<IFile[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
