import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MemoryGameComponent, Card } from './memorycard-game.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MemoryGameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MemoryGameComponent]
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create correct deck size for selected difficulty', () => {
    const { component } = createComponent();

    component.currentDifficulty = component.difficultyConfigs[0].level; // EASY maxPieces: 8 -> 4 pairs -> 8 cards
    component.initializeGame();
    expect(component.cards.length).toBe(8);

    component.currentDifficulty = component.difficultyConfigs[1].level; // MEDIUM 16 -> 8 pairs -> 16 cards
    component.initializeGame();
    expect(component.cards.length).toBe(16);

    component.currentDifficulty = component.difficultyConfigs[2].level; // HARD 24 -> 12 pairs -> 24 cards
    component.initializeGame();
    expect(component.cards.length).toBe(24);
  });

  it('should increase score by 2 and mark as matched on a correct pair', () => {
    const { component } = createComponent();

    // Build deterministic small deck with one matching pair
    const a: Card = { id: 1, image: 'A', isFlipped: false, isMatched: false };
    const b: Card = { id: 2, image: 'A', isFlipped: false, isMatched: false };
    const c: Card = { id: 3, image: 'B', isFlipped: false, isMatched: false };
    const d: Card = { id: 4, image: 'B', isFlipped: false, isMatched: false };
    component.cards = [a, b, c, d];

    component.flipCard(a);
    component.flipCard(b);

    expect(component.score).toBe(2);
    expect(a.isMatched && b.isMatched).toBeTrue();
    expect(component.flippedCards.length).toBe(0);
    expect(component.isCheckingMatch).toBeFalse();
  });

  it('should decrease score by 2 and flip back after mismatch', fakeAsync(() => {
    const { component } = createComponent();

    const a: Card = { id: 1, image: 'A', isFlipped: false, isMatched: false };
    const b: Card = { id: 2, image: 'B', isFlipped: false, isMatched: false };
    component.cards = [a, b];

    component.flipCard(a);
    component.flipCard(b);

    expect(component.score).toBe(-2);
    // After 1s the cards flip back
    tick(1100);
    expect(a.isFlipped || b.isFlipped).toBeFalse();
    expect(component.flippedCards.length).toBe(0);
    expect(component.isCheckingMatch).toBeFalse();
  }));
});
// Intentionally empty: Memory Card tests were removed per request.
export {};
