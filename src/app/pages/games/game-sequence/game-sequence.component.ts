import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameSequenceService } from './game-sequence.service';
import { finalize, take } from 'rxjs/operators';

type Difficulty = 'facil' | 'medio' | 'dificil';

@Component({
  selector: 'app-game-sequence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-sequence.component.html',
  styleUrls: ['./game-sequence.component.scss']
})
export class GameSequenceComponent {
  public readonly SEQUENCE_LENGTH = 5;
  public readonly MAX_ATTEMPTS = 3;
  public readonly MAX_RESTARTS = 2;
  public readonly SCORE_INCREMENT = 10;
  public readonly FEEDBACK_DELAY = 1200;
  public readonly RESTART_DELAY = 1500;

  sequence: number[] = [];
  userAnswer = '';
  hiddenIndex = 0;
  correctAnswer = 0;
  score = 0;
  message = '';
  gameOver = false;

  intentosRestantes = this.MAX_ATTEMPTS;
  reiniciosUsados = 0;

  difficulty: Difficulty = 'facil';

  difficultiesConfig: Record<Difficulty, { type: 'aritmetica' | 'geometrica' | 'mixta'; stepRange: [number, number] }> = {
    facil:  { type: 'aritmetica', stepRange: [2, 4] },
    medio:  { type: 'geometrica', stepRange: [2, 3] },
    dificil:{ type: 'mixta',      stepRange: [2, 4] }
  };

  private saving = false;

  constructor(private readonly seqSvc: GameSequenceService) {}

  ngOnInit(): void {
    this.seqSvc.setDifficulty(this.difficulty);
    this.seqSvc.setScore(this.score);
    this.generateSequence();
  }

  setDifficulty(level: Difficulty): void {
    this.difficulty = level;
    this.score = 0;
    this.reiniciosUsados = 0;
    this.seqSvc.setDifficulty(level);
    this.seqSvc.setScore(this.score);
    this.generateSequence();
  }

  generateSequence(): void {
    this.resetGameState();

    const { type, stepRange } = this.difficultiesConfig[this.difficulty];
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * (stepRange[1] - stepRange[0] + 1)) + stepRange[0];

    if (type === 'aritmetica') {
      this.sequence = Array.from({ length: this.SEQUENCE_LENGTH }, (_, i) => start + i * step);
    } else if (type === 'geometrica') {
      this.sequence = Array.from({ length: this.SEQUENCE_LENGTH }, (_, i) => start * Math.pow(step, i));
    } else { // mixta
      this.sequence = [start];
      for (let i = 1; i < this.SEQUENCE_LENGTH; i++) {
        const prev = this.sequence[i - 1];
        this.sequence.push(i % 2 === 0 ? prev + step : prev - step);
      }
    }

    this.hiddenIndex = Math.floor(Math.random() * this.SEQUENCE_LENGTH);
    this.correctAnswer = this.sequence[this.hiddenIndex];
    this.sequence[this.hiddenIndex] = NaN; 
  }

  private resetGameState(): void {
    this.message = '';
    this.userAnswer = '';
    this.gameOver = false;
    this.intentosRestantes = this.MAX_ATTEMPTS;
  }

  isNumberHidden(value: number): boolean {
    return Number.isNaN(value);
  }

  checkAnswer(): void {
    const answer = parseInt(this.userAnswer, 10);
    if (!Number.isFinite(answer)) {
      this.message = '⚠️ Ingresá un número válido.';
      return;
    }

    if (answer === this.correctAnswer) {
      this.score += this.SCORE_INCREMENT;
      this.seqSvc.setScore(this.score);
      this.message = '✅ ¡Muy bien! Secuencia completada.';

      this.saveScoreOnce();

      setTimeout(() => this.generateSequence(), this.FEEDBACK_DELAY);
    } else {
      this.intentosRestantes--;
      if (this.intentosRestantes > 0) {
        this.message = `❌ Incorrecto. Te quedan ${this.intentosRestantes} intento(s).`;
      } else if (this.reiniciosUsados < this.MAX_RESTARTS) {
        this.reiniciosUsados++;
        this.message = `🔁 Se reinicia la secuencia automáticamente (${this.reiniciosUsados}/${this.MAX_RESTARTS} reinicios usados).`;
        setTimeout(() => this.generateSequence(), this.RESTART_DELAY);
      } else {
        this.message = '🚫 Sin intentos ni reinicios disponibles. Juego terminado.';
        this.gameOver = true;
        this.saveScoreOnce();
      }
    }

    this.userAnswer = ''; 
  }

  restartGame(): void {
    if (this.reiniciosUsados < this.MAX_RESTARTS) {
      this.reiniciosUsados++;
      this.score = 0;
      this.seqSvc.setScore(this.score);
      this.generateSequence();
    } else {
      this.message = '❌ Ya no podés reiniciar el juego.';
    }
  }

  private saveScoreOnce(): void {
    if (this.saving) return;
    this.saving = true;
    this.seqSvc.saveFinalScore()
      .pipe(take(1), finalize(() => { this.saving = false; }))
      .subscribe();
  }
}
