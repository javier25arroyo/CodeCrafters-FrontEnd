import { TestBed } from '@angular/core/testing';
import { PuzzleBoardComponent } from '../app/pages/games/puzzle-board/puzzle-board.component';
import { PuzzleService, DifficultyLevel } from '../app/pages/games/puzzle-board/puzzle.game.service';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PuzzleBoardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, PuzzleBoardComponent],
      providers: [PuzzleService]
    }).compileComponents();
  });

  it('should render and update board size on difficulty change', () => {
    const fixture = TestBed.createComponent(PuzzleBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const initialSize = component.boardSize;
    expect(initialSize).toBe(3);

    component.changeDifficulty(DifficultyLevel.MEDIUM);
    fixture.detectChanges();

    expect(component.boardSize).toBe(4);
    expect(component.isCurrentDifficulty(DifficultyLevel.MEDIUM)).toBeTrue();
  });

  it('formatTime should return mm:ss', () => {
    const fixture = TestBed.createComponent(PuzzleBoardComponent);
    const component = fixture.componentInstance;

    expect(component.formatTime(0)).toBe('00:00');
    expect(component.formatTime(5)).toBe('00:05');
    expect(component.formatTime(65)).toBe('01:05');
  });
});
