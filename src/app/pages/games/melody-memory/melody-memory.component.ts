import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MusicMemoryService } from './music-memory.service';

interface Note {
  freq: number;
  label: string;
}

@Component({
  selector: 'app-melody-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './melody-memory.component.html',
  styleUrls: ['./melody-memory.component.scss'],
})
export class MelodyMemoryComponent implements OnInit {
  notes: Note[] = [
    { freq: 261.6, label: 'Do' },
    { freq: 293.7, label: 'Re' },
    { freq: 329.6, label: 'Mi' },
    { freq: 349.2, label: 'Fa' },
    { freq: 392.0, label: 'Sol' },
    { freq: 440.0, label: 'La' },
    { freq: 493.9, label: 'Si' },
    { freq: 523.3, label: 'Do′' }
  ];

  sequence: Note[] = [];
  userSequence: Note[] = [];
  isPlaying: boolean = false;
  level: number = 1;
  message: string = '';
  currentNotePlaying: number | null = null;

  selectedLevel: 'easy' | 'medium' | 'hard' = 'easy';
  score: number = 0;
  levelStartTime: number = 0;

  // Usar un solo contexto de audio para todo el juego
  private audioContext = new AudioContext();

  constructor(
    private http: HttpClient,
    @Inject(MusicMemoryService) private musicMemoryService: MusicMemoryService
  ) {}

  ngOnInit(): void {
    this.musicMemoryService.setDifficulty(this.selectedLevel as any);
    this.startNewGame();
  }

  startNewGame(): void {
    this.stopAllSounds(); // parar cualquier nota pendiente
    this.sequence = [];
    this.userSequence = [];
    this.level = this.getLevelNumber(this.selectedLevel);

    for (let i = 0; i < this.getNoteCountForLevel(); i++) {
      this.addNoteToSequence();
    }

    this.levelStartTime = Date.now();
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
      await this.playNoteAsync(note.freq);
      this.currentNotePlaying = null;
      await this.sleep(300);
    }

    this.isPlaying = false;
    this.userSequence = [];
    this.message = '🎶 Tu turno';
  }

  playNote(freq: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.value = 0.8;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  playNoteAsync(freq: number): Promise<void> {
    return new Promise((resolve) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.value = 0.8;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.5);

      oscillator.onended = () => resolve();
    });
  }

  pressNote(note: Note): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentNotePlaying = note.freq;
    this.playNote(note.freq);

    this.userSequence.push(note);
    const currentIndex = this.userSequence.length - 1;

    if (note.freq !== this.sequence[currentIndex].freq) {
      this.message = '❌ Fallaste. Reiniciando...';
      setTimeout(() => {
        this.isPlaying = false;
        this.currentNotePlaying = null;
        this.startNewGame();
      }, 1500);
      return;
    }

    if (this.userSequence.length === this.sequence.length) {
      this.score++;
      this.sendScoreToBackend();
      this.message = '✅ Bien hecho. Siguiente nivel...';
      setTimeout(() => {
        this.isPlaying = false;
        this.currentNotePlaying = null;
        this.level++;
        this.addNoteToSequence();
        this.levelStartTime = Date.now();
        this.playSequence();
      }, 1500);
      return;
    }

    setTimeout(() => {
      this.isPlaying = false;
      this.currentNotePlaying = null;
    }, 600);
  }

  stopAllSounds(): void {
    // Reinicia el contexto de audio si estaba parado
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    this.currentNotePlaying = null;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  selectLevel(level: 'easy' | 'medium' | 'hard'): void {
    if (this.isPlaying) {
    console.warn('No se puede cambiar de nivel mientras se está reproduciendo la secuencia.');
    return;
    }
    
    this.selectedLevel = level;
    this.level = this.getLevelNumber(level);
    this.musicMemoryService.setDifficulty(level as any);

    this.sequence = [];
    for (let i = 0; i < this.getNoteCountForLevel(); i++) {
      this.addNoteToSequence();
    }

    this.playSequence();
  }

  getLevelNumber(level: 'easy' | 'medium' | 'hard'): number {
    switch (level) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  }

  getNoteCountForLevel(): number {
    switch (this.selectedLevel) {
      case 'easy': return 1;
      case 'medium': return 3;
      case 'hard': return 5;
      default: return 1;
    }
  }

  private mapSelectedLevelToLevelEnum(): string {
    switch (this.selectedLevel) {
      case 'easy': return 'EASY';
      case 'medium': return 'MEDIUM';
      case 'hard': return 'HARD';
      default: return 'EASY';
    }
  }

  sendScoreToBackend(): void {
    this.musicMemoryService.submitScore(this.score).subscribe({
      next: res => console.log('Score guardado:', res),
      error: err => console.error('Error guardando score:', err)
    });
  }
}
