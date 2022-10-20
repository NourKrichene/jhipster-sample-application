import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICollaborater } from '../collaborater.model';
import { CollaboraterService } from '../service/collaborater.service';

@Injectable({ providedIn: 'root' })
export class CollaboraterRoutingResolveService implements Resolve<ICollaborater | null> {
  constructor(protected service: CollaboraterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollaborater | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collaborater: HttpResponse<ICollaborater>) => {
          if (collaborater.body) {
            return of(collaborater.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
