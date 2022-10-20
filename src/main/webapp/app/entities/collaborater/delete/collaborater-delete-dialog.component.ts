import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICollaborater } from '../collaborater.model';
import { CollaboraterService } from '../service/collaborater.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './collaborater-delete-dialog.component.html',
})
export class CollaboraterDeleteDialogComponent {
  collaborater?: ICollaborater;

  constructor(protected collaboraterService: CollaboraterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.collaboraterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
