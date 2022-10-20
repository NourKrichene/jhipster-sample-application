import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CollaboraterComponent } from './list/collaborater.component';
import { CollaboraterDetailComponent } from './detail/collaborater-detail.component';
import { CollaboraterUpdateComponent } from './update/collaborater-update.component';
import { CollaboraterDeleteDialogComponent } from './delete/collaborater-delete-dialog.component';
import { CollaboraterRoutingModule } from './route/collaborater-routing.module';

@NgModule({
  imports: [SharedModule, CollaboraterRoutingModule],
  declarations: [CollaboraterComponent, CollaboraterDetailComponent, CollaboraterUpdateComponent, CollaboraterDeleteDialogComponent],
})
export class CollaboraterModule {}
