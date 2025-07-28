import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-caregiver-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caregiver-stats.component.html',
  styleUrls: ['./caregiver-stats.component.scss']
})
export class CaregiverStatsComponent {
  public email: string = '';
  public userData: { id: number; name: string; email: string } | null = null;

  public onSearch(): void {
    if (!this.email) {
      this.userData = null;
      return;
    }
  }
}