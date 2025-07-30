import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../components/nav/nav.component';

interface Note {
  freq: number;
  label: string;
}

@Component({
  selector: 'app-melody-memory',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './melody-memory.component.html',
  styleUrls: ['./melody-memory.component.scss'],
})
export class MelodyMemoryComponent implements OnInit {
  notes: Note[] = [
    { freq: 261.6, label: 'Do' },
    { freq: 329.6, label: 'Mi' },
    { freq: 392.0, label: 'Sol' },
    { freq: 523.3, label: 'Do′' }
  ];

  sequence: Note[] = [];
  userSequence: Note[] = [];
  isPlaying: boolean = false;
  level: number = 1;
  message: string = '';
  currentNotePlaying: number | null = null;

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame(): void {
    this.level = 1;
    this.sequence = [];
    this.addNoteToSequence();
    this.playSequence();
  }

  addNoteToSequence(): void {
    const randomIndex = Math.floor(Math.random() * this.notes.length);
    this.sequence.push(this.notes[randomIndex]);
  }

  async playSequence(): Promise<void> {
    this.isPlaying = true;
    this.message = '🎵 Escucha la secuencia...';

    for (const note of this.sequence) {
      this.currentNotePlaying = note.freq;
      this.playNote(note.freq);
      await this.sleep(800);
      this.currentNotePlaying = null;
      await this.sleep(200); // Pausa entre notas
    }

    this.isPlaying = false;
    this.userSequence = [];
    this.message = '🎶 Tu turno';
  }

  playNote(freq: number): void {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  }

  pressNote(note: Note): void {
    if (this.isPlaying) return;

    this.playNote(note.freq);
    this.userSequence.push(note);

    const currentIndex = this.userSequence.length - 1;
    if (note.freq !== this.sequence[currentIndex].freq) {
      this.message = '❌ Fallaste. Reiniciando...';
      setTimeout(() => this.startNewGame(), 1500);
      return;
    }

    if (this.userSequence.length === this.sequence.length) {
      this.message = '✅ Bien hecho. Siguiente nivel...';
      setTimeout(() => {
        this.level++;
        this.addNoteToSequence();
        this.playSequence();
      }, 1500);
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
