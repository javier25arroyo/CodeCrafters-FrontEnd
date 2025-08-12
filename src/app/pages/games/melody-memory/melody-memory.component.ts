import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MusicMemoryService, DifficultyLevel } from './music-memory.service';
import { DifficultySelectorComponent } from '../../../components/difficulty-selector/difficulty-selector.component';

interface Note {
  freq: number;
  label: string;
}
interface DifficultyConfig {
  level: DifficultyLevel;
  label: string;
}

@Component({
  selector: 'app-melody-memory',
  standalone: true,

  imports: [CommonModule, DifficultySelectorComponent],

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
  isPlaying = false;
  level = 1;
  message = '';
  currentNotePlaying: number | null = null;

  score = 0;
  levelStartTime = 0;

  currentDifficulty: DifficultyLevel = DifficultyLevel.EASY;
  difficultyConfigs = [
    { level: DifficultyLevel.EASY, label: 'Fácil', boardSize: 0, maxPieces: 0 },
    { level: DifficultyLevel.MEDIUM, label: 'Medio', boardSize: 0, maxPieces: 0 },
    { level: DifficultyLevel.HARD, label: 'Difícil', boardSize: 0, maxPieces: 0 }
  ];



  private audioContext = new AudioContext();

  constructor(
    private http: HttpClient,
    @Inject(MusicMemoryService) private musicMemoryService: MusicMemoryService
  ) { }

  ngOnInit(): void {
    this.musicMemoryService.setDifficulty(this.currentDifficulty);
    this.startNewGame();
  }


  changeDifficulty(level: DifficultyLevel): void {
    if (this.isPlaying) return;
    this.currentDifficulty = level;
    this.musicMemoryService.setDifficulty(level);
    this.startNewGame();
  }

  startNewGame(): void {
    this.stopAllSounds();
    this.sequence = [];
    this.userSequence = [];
    this.level = this.getLevelNumber(this.currentDifficulty);

    for (let i = 0; i < this.getNoteCountForLevel(); i++) {
      this.addNoteToSequence();
    }

    this.levelStartTime = Date.now();
    this.message = 'Presiona "Reproducir" para escuchar la secuencia';
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
      this.sendScoreToBackend(1);
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
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    this.currentNotePlaying = null;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getLevelNumber(level: DifficultyLevel): number {
    switch (level) {
      case DifficultyLevel.EASY: return 1;
      case DifficultyLevel.MEDIUM: return 2;
      case DifficultyLevel.HARD: return 3;
    }
  }

  getNoteCountForLevel(): number {
    switch (this.currentDifficulty) {
      case DifficultyLevel.EASY: return 1;
      case DifficultyLevel.MEDIUM: return 2;
      case DifficultyLevel.HARD: return 3;
    }
  }

  sendScoreToBackend(increment: number): void {
    this.musicMemoryService.submitScore(increment).subscribe({
      next: res => console.log('Score guardado:', res),
      error: err => console.error('Error guardando score:', err)
    });
  }
}
