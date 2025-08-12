import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-chess-timer',
  templateUrl: './chess-timer.component.html',
  styleUrls: ['./chess-timer.component.css'],
  standalone: true
})
export class ChessTimerComponent implements OnInit, OnDestroy {
  @Input() initialSeconds: number = 0;
  public seconds: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.seconds = this.initialSeconds;
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  get formattedTime(): string {
    const min = Math.floor(this.seconds / 60).toString().padStart(2, '0');
    const sec = (this.seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
}
