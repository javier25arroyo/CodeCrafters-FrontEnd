import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IUser, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';


describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfileService,
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getUserInfoSignal should update user$ signal with response', () => {
    const mockUser: IUser = { id: 1, name: 'Leo' } as any;

    service.getUserInfoSignal();

    const req = httpMock.expectOne('users/me');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockUser } as unknown as IResponse<IUser>);

    const value = service.user$();
    expect(value.id).toBe(1);
    expect(value.name).toBe('Leo');
  });
});
