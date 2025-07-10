import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'daily-tip',
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
    'Gratitude changes your perspective — think of 3 things you’re grateful for.',
    'Connect with friends or family — social interaction is key to well-being.',
    'Read a book or try a puzzle to keep your mind sharp.',
    'Eat a balanced diet rich in fruits and vegetables.',
    'Practice mindfulness or meditation for a few minutes each day.',
    'Listen to your favorite music to lift your spirits.',
    'Spend time outdoors and enjoy some fresh air.',
    'Keep a regular routine to help your body and mind stay balanced.',
    'Laugh often — it’s good for your heart and mind.',
    'Limit screen time and give your eyes a break.',
    'Try something new — learning keeps your brain healthy.',
    'Write down your thoughts or keep a journal.',
    'Stretch gently in the morning to start your day right.',
    'Take time to appreciate nature around you.',
    'Practice deep breathing before bed to help you relax.',
    'Stay curious and ask questions about the world.',
    'Help someone else — kindness boosts your own happiness.',
    'Keep your living space tidy for a clearer mind.',
    'Enjoy a hobby or craft you love.',
    'Smile at yourself in the mirror each morning.',
    'Plan your day, but allow time for rest.',
    'Celebrate small achievements every day.',
    'Drink herbal tea to relax in the evening.',
    'Keep in touch with loved ones, even with a simple call.',
    'Take a moment to notice your achievements.',
    'Remember, it’s okay to ask for help when you need it.'
  ];

  currentTip: string = '';
  private index: number = 0;

  ngOnInit(): void {
    this.index = Math.floor(Math.random() * this.wellnessTips.length);
    this.currentTip = this.wellnessTips[this.index];
    setInterval(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * this.wellnessTips.length);
      } while (nextIndex === this.index && this.wellnessTips.length > 1);
      this.index = nextIndex;
      this.currentTip = '';
      setTimeout(() => {
        this.currentTip = this.wellnessTips[this.index];
      }, 100);
    }, 7000);
  }
}