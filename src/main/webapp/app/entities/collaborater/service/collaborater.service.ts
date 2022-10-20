import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICollaborater, NewCollaborater } from '../collaborater.model';

export type PartialUpdateCollaborater = Partial<ICollaborater> & Pick<ICollaborater, 'id'>;

type RestOf<T extends ICollaborater | NewCollaborater> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestCollaborater = RestOf<ICollaborater>;

export type NewRestCollaborater = RestOf<NewCollaborater>;

export type PartialUpdateRestCollaborater = RestOf<PartialUpdateCollaborater>;

export type EntityResponseType = HttpResponse<ICollaborater>;
export type EntityArrayResponseType = HttpResponse<ICollaborater[]>;

@Injectable({ providedIn: 'root' })
export class CollaboraterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/collaboraters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(collaborater: NewCollaborater): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaborater);
    return this.http
      .post<RestCollaborater>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(collaborater: ICollaborater): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaborater);
    return this.http
      .put<RestCollaborater>(`${this.resourceUrl}/${this.getCollaboraterIdentifier(collaborater)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(collaborater: PartialUpdateCollaborater): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collaborater);
    return this.http
      .patch<RestCollaborater>(`${this.resourceUrl}/${this.getCollaboraterIdentifier(collaborater)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCollaborater>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCollaborater[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCollaboraterIdentifier(collaborater: Pick<ICollaborater, 'id'>): number {
    return collaborater.id;
  }

  compareCollaborater(o1: Pick<ICollaborater, 'id'> | null, o2: Pick<ICollaborater, 'id'> | null): boolean {
    return o1 && o2 ? this.getCollaboraterIdentifier(o1) === this.getCollaboraterIdentifier(o2) : o1 === o2;
  }

  addCollaboraterToCollectionIfMissing<Type extends Pick<ICollaborater, 'id'>>(
    collaboraterCollection: Type[],
    ...collaboratersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const collaboraters: Type[] = collaboratersToCheck.filter(isPresent);
    if (collaboraters.length > 0) {
      const collaboraterCollectionIdentifiers = collaboraterCollection.map(
        collaboraterItem => this.getCollaboraterIdentifier(collaboraterItem)!
      );
      const collaboratersToAdd = collaboraters.filter(collaboraterItem => {
        const collaboraterIdentifier = this.getCollaboraterIdentifier(collaboraterItem);
        if (collaboraterCollectionIdentifiers.includes(collaboraterIdentifier)) {
          return false;
        }
        collaboraterCollectionIdentifiers.push(collaboraterIdentifier);
        return true;
      });
      return [...collaboratersToAdd, ...collaboraterCollection];
    }
    return collaboraterCollection;
  }

  protected convertDateFromClient<T extends ICollaborater | NewCollaborater | PartialUpdateCollaborater>(collaborater: T): RestOf<T> {
    return {
      ...collaborater,
      creationDate: collaborater.creationDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCollaborater: RestCollaborater): ICollaborater {
    return {
      ...restCollaborater,
      creationDate: restCollaborater.creationDate ? dayjs(restCollaborater.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCollaborater>): HttpResponse<ICollaborater> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCollaborater[]>): HttpResponse<ICollaborater[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
