import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollaborater } from '../collaborater.model';

@Component({
  selector: 'jhi-collaborater-detail',
  templateUrl: './collaborater-detail.component.html',
})
export class CollaboraterDetailComponent implements OnInit {
  collaborater: ICollaborater | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collaborater }) => {
      this.collaborater = collaborater;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
