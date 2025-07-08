import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-tip.component.html',
  styleUrls: ['./daily-tip.component.scss']
})
export class DailyTipComponent implements OnInit {
  wellnessTips: string[] = [
    'Stay active! A short walk or some light stretching can boost your mood and energy levels.',
    'Remember to hydrate! Drinking water keeps your mind and body sharp.',
    'Take a deep breath — it helps reduce stress and improve focus.',
    'A good night’s sleep can boost your memory and mood.',
    'Gratitude changes your perspective — think of 3 things you’re grateful for.'
  ];

  currentTip: string = '';
  private index: number = 0;

  ngOnInit(): void {
    this.currentTip = this.wellnessTips[this.index];
    setInterval(() => {
      this.index = (this.index + 1) % this.wellnessTips.length;
      this.currentTip = '';
      setTimeout(() => {
        this.currentTip = this.wellnessTips[this.index];
      }, 100);
    }, 7000);
  }
}
