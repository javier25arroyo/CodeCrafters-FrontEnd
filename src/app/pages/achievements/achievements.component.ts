import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService } from '../../services/achievements.service';
import { Achievement, pct } from './achievements.model';
import { NavComponent } from '../../components/nav/nav.component';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, NavComponent,],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent {
  loading = true;
  error = '';
  list: Achievement[] = [];

  constructor(private service: AchievementsService) {
    const userId = Number(localStorage.getItem('user_id') ?? 3);

    this.service.getAchievements(userId).subscribe({
      next: (ach) => { this.list = ach; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los logros.'; this.loading = false; }
    });
  }

  percent(a: Achievement) { return pct(a); }
  trackByKey = (_: number, a: Achievement) => a.key;
}
