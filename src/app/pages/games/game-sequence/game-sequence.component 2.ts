import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-sequence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-sequence.component.html',
  styleUrls: ['./game-sequence.component.scss']
})
export class GameSequenceComponent {
  sequence: number[] = [];
  userAnswer = '';
  hiddenIndex = 0;
  correctAnswer = 0;
  score = 0;
  level = 1;
  maxLevels = 3;
  message = '';
  gameOver = false;

  intentosRestantes = 3;
  maxReinicios = 2;
  reiniciosUsados = 0;

  ngOnInit() {
    this.generateSequence();
  }

  generateSequence() {
    this.message = '';
    this.userAnswer = '';
    this.gameOver = false;
    this.intentosRestantes = 3;

    const start = Math.floor(Math.random() * 5) + 1;
    let step = Math.floor(Math.random() * 3) + 2;

    if (this.level === 1) {
      // Suma
      this.sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    } else if (this.level === 2) {
      // Multiplicación
      step = Math.floor(Math.random() * 2) + 2;
      this.sequence = Array.from({ length: 5 }, (_, i) => start * Math.pow(step, i));
    } else if (this.level === 3) {
      // Suma y resta
      this.sequence = [start];
      for (let i = 1; i < 5; i++) {
        const prev = this.sequence[i - 1];
        this.sequence.push(i % 2 === 0 ? prev + step : prev - step);
      }
    }

    this.hiddenIndex = Math.floor(Math.random() * 5);
    this.correctAnswer = this.sequence[this.hiddenIndex];
    this.sequence[this.hiddenIndex] = NaN;
  }

  isNumberHidden(value: number): boolean {
    return isNaN(value);
  }

  checkAnswer() {
    if (parseInt(this.userAnswer) === this.correctAnswer) {
      this.score += 10;
      if (this.level < this.maxLevels) {
        this.level++;
        this.message = '✅ ¡Muy bien! Pasaste al siguiente nivel.';
        setTimeout(() => this.generateSequence(), 1200);
      } else {
        this.message = '🎉 ¡Excelente! Completaste todos los niveles.';
        this.gameOver = true;
      }
    } else {
      this.intentosRestantes--;
      if (this.intentosRestantes > 0) {
        this.message = `❌ Incorrecto. Te quedan ${this.intentosRestantes} intento(s).`;
      } else if (this.reiniciosUsados < this.maxReinicios) {
        this.reiniciosUsados++;
        this.message = `🔁 Se reinicia el nivel automáticamente (${this.reiniciosUsados}/${this.maxReinicios} reinicios usados).`;
        setTimeout(() => this.generateSequence(), 1500);
      } else {
        this.message = '🚫 Sin intentos ni reinicios disponibles. Juego terminado.';
        this.gameOver = true;
      }
    }
  }

  restartGame() {
    if (this.reiniciosUsados < this.maxReinicios) {
      this.reiniciosUsados++;
      this.level = 1;
      this.score = 0;
      this.generateSequence();
    } else {
      this.message = '❌ Ya no podés reiniciar el juego.';
    }
  }
}
