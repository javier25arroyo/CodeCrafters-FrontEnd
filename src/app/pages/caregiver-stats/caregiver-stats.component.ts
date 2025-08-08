import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaregiverService } from '../../services/caregiver.service';
import { AuthService } from '../../services/auth.service';
import { IUser, IUserCaregiver } from '../../interfaces';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-caregiver-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavComponent],
  templateUrl: './caregiver-stats.component.html',
  styleUrls: ['./caregiver-stats.component.scss']
})
export class CaregiverStatsComponent {
  public email = '';
  public userData: IUser | null = null;
  public loading = false;
  public error = '';

  constructor(
    private svc: CaregiverService,
    private auth: AuthService
  ) {}

  private normalizeEmail(e: string): string {
    return (e || '').trim().toLowerCase();
  }

  public onSearch(): void {
  this.error = '';
  this.userData = null;

  if (!this.email.trim()) {
    this.error = 'Ingresa un correo para buscar.';
    return;
  }
  this.loading = true;

  this.svc.getUserByEmail(this.email).subscribe({
    next: (user) => {
      this.userData = user;
      this.loading = false;
    },
    error: (err) => {
      this.error = (err?.status === 404)
        ? 'No se encontró ningún usuario con ese email.'
        : 'No se pudo buscar en este momento. Inténtalo de nuevo.';
      this.loading = false;
    }
  });
}

  public clearSearch(): void {
    this.email = '';
    this.userData = null;
    this.error = '';
  }
}
