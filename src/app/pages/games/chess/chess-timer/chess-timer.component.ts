import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chess-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer">
      <span class="time">{{ display }}</span>
    </div>
  `,
  styles: [
    `.timer { display: inline-flex; align-items: center; gap: .5rem; font-family: system-ui, Arial, sans-serif; }`,
    `.time { font-weight: 600; font-variant-numeric: tabular-nums; }`
  ]
})
export class ChessTimerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() direction: 'up' | 'down' = 'up';
  @Input() duration = 300;
  @Input() running = false;
  @Input() startImmediately = false;

  @Output() finished = new EventEmitter<void>();
  @Output() timeChange = new EventEmitter<number>();

  private intervalId: any;
  private seconds = 0;

  get display(): string {
    const s = this.direction === 'down' ? Math.max(0, this.seconds) : Math.max(0, this.seconds);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  ngOnInit(): void {
    this.seconds = this.direction === 'down' ? this.duration : 0;
    if (this.startImmediately || this.running) this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['running'] && !changes['running'].firstChange) {
      this.running ? this.start() : this.stop();
    }
    if (changes['direction'] && !changes['direction'].firstChange) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      if (this.direction === 'down') {
        this.seconds--;
        if (this.seconds <= 0) {
          this.seconds = 0;
          this.timeChange.emit(this.seconds);
          this.finished.emit();
          this.stop();
          return;
        }
      } else {
        this.seconds++;
      }
      this.timeChange.emit(this.seconds);
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.stop();
    this.seconds = this.direction === 'down' ? this.duration : 0;
    this.timeChange.emit(this.seconds);
    if (this.startImmediately || this.running) this.start();
  }
}
