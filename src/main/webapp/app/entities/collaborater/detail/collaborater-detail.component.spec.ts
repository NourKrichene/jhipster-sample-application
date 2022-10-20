import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CollaboraterDetailComponent } from './collaborater-detail.component';

describe('Collaborater Management Detail Component', () => {
  let comp: CollaboraterDetailComponent;
  let fixture: ComponentFixture<CollaboraterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollaboraterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ collaborater: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CollaboraterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CollaboraterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load collaborater on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.collaborater).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
