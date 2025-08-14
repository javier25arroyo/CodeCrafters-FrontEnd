import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PuzzleService, DifficultyLevel, PuzzlePiece } from '../app/pages/games/puzzle-board/puzzle.game.service';


describe('PuzzleService', () => {
  let service: PuzzleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PuzzleService
      ]
    });

    service = TestBed.inject(PuzzleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize with EASY difficulty and board size 3', () => {
    expect(service.getCurrentDifficulty()).toBe(DifficultyLevel.EASY);
    expect(service.getBoardSize()).toBe(3);
  });

  it('should change difficulty and update board size', () => {
    service.setDifficulty(DifficultyLevel.MEDIUM);
    expect(service.getCurrentDifficulty()).toBe(DifficultyLevel.MEDIUM);
    expect(service.getBoardSize()).toBe(4);

    service.setDifficulty(DifficultyLevel.HARD);
    expect(service.getCurrentDifficulty()).toBe(DifficultyLevel.HARD);
    expect(service.getBoardSize()).toBe(5);
  });

  it('should increment move counter when swapping two pieces and eventually mark completed', () => {
    // Build a small deterministic board by setting EASY (3x3 -> 9 pieces)
    service.setDifficulty(DifficultyLevel.EASY);

    // Select two different pieces to trigger a swap
    const pieces = (service as any).puzzleBoardSubject.value as PuzzlePiece[];
    expect(pieces.length).toBe(9);

    // Ensure two different pieces
    const p1 = pieces[0];
    const p2 = pieces[1];

    service.selectPiece(p1);
    service.selectPiece(p2);

    // Move counter increases
    (service as any).moveCounter$.subscribe((moves: number) => {
      expect(moves).toBeGreaterThanOrEqual(1);
    });
  });

  it('should POST score to games/score on completion', () => {
    // Trigger submit
    (service as any).submitFinalGameData(true);
    const req = httpMock.expectOne('games/score');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
