import { Component, inject } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaregiverService } from '../../services/caregiver.service';
import { IUser } from '../../interfaces';

type UserDisplay = { name: string; email: string };

@Component({
  selector: 'app-caregiver-stats',
  standalone: true,
  imports: [NgIf, FormsModule, NavComponent],
  templateUrl: './caregiver-stats.component.html',
  styleUrls: ['./caregiver-stats.component.scss']
})
export class CaregiverStatsComponent {
  private userSvc = inject(CaregiverService);

  email = '';
  loading = false;
  error = '';
  userData: UserDisplay | null = null;

  onSearch(): void {
    this.error = '';
    this.userData = null;

    const q = this.email.trim();
    if (!q) {
      this.error = 'Ingresa un correo para buscar.';
      return;
    }

    this.loading = true;

    this.userSvc.getUserByEmail(q).subscribe({
      next: (u: IUser | any) => {
        const name =
          u?.name ??
          u?.fullName ??
          (u?.firstName || u?.lastName ? `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim() : undefined) ??
          u?.username ??
          '—';

        const email =
          u?.email ?? u?.mail ?? u?.userEmail ?? q;

        this.userData = { name, email };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.status === 404
            ? 'No se encontró ningún usuario con ese correo.'
            : 'No se pudo realizar la búsqueda. Intenta de nuevo.';
      }
    });
  }
}
