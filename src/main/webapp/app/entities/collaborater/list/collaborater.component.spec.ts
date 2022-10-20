import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CollaboraterService } from '../service/collaborater.service';

import { CollaboraterComponent } from './collaborater.component';

describe('Collaborater Management Component', () => {
  let comp: CollaboraterComponent;
  let fixture: ComponentFixture<CollaboraterComponent>;
  let service: CollaboraterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'collaborater', component: CollaboraterComponent }]), HttpClientTestingModule],
      declarations: [CollaboraterComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CollaboraterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollaboraterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CollaboraterService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.collaboraters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to collaboraterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCollaboraterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCollaboraterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
