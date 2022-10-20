import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CollaboraterComponent } from '../list/collaborater.component';
import { CollaboraterDetailComponent } from '../detail/collaborater-detail.component';
import { CollaboraterUpdateComponent } from '../update/collaborater-update.component';
import { CollaboraterRoutingResolveService } from './collaborater-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const collaboraterRoute: Routes = [
  {
    path: '',
    component: CollaboraterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollaboraterDetailComponent,
    resolve: {
      collaborater: CollaboraterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollaboraterUpdateComponent,
    resolve: {
      collaborater: CollaboraterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollaboraterUpdateComponent,
    resolve: {
      collaborater: CollaboraterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(collaboraterRoute)],
  exports: [RouterModule],
})
export class CollaboraterRoutingModule {}
