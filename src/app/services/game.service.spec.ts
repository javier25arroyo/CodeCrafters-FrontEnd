import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IGame, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GameService,
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAllGames should call GET games and map data', () => {
    const mockGames: IGame[] = [{ id: 1, name: 'Chess', status: 'active' } as any];
    let received: IGame[] | undefined;

  service.getAllGames().subscribe(data => (received = data));

    const req = httpMock.expectOne('games');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockGames } as IResponse<IGame[]>);

    expect(received).toEqual(mockGames);
  });

  it('getAll should populate items$ signal', () => {
    const mockGames: IGame[] = [
      { id: 1, name: 'Chess', status: 'active' } as any,
      { id: 2, name: 'Checkers', status: 'active' } as any
    ];
    service.getAll();

    const req = httpMock.expectOne('games');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockGames } as IResponse<IGame[]>);

    const value = service.items$();
    expect(value.length).toBe(2);
    // Should be reversed order per service logic
    expect(value[0].id).toBe(2);
    expect(value[1].id).toBe(1);
  });
});
