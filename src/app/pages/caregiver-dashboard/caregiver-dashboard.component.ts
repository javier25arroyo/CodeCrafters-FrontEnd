// src/app/pages/caregiver-dashboard/caregiver-dashboard.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { CaregiverService }     from '../../services/caregiver.service';
import { AuthService }          from '../../services/auth.service';
import { IUserCaregiver }       from '../../interfaces';
import { HttpClientModule }     from '@angular/common/http';
import { RouterLink }           from '@angular/router';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-caregiver-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, NavComponent,FooterComponent],
  templateUrl: './caregiver-dashboard.component.html',
  styleUrls: ['./caregiver-dashboard.component.scss']
})
export class CaregiverDashboardComponent implements OnInit {
  public data: IUserCaregiver[] = [];
  public error = '';

  constructor(
    private svc: CaregiverService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const me = this.auth.getUser()?.email;
    if (!me) {
      this.error = 'No hay usuario autenticado';
      return;
    }

    this.svc.getDashboard(me).subscribe({
      next: (arr: IUserCaregiver[]) => this.data = arr,
      error:   ()             => this.error = 'Error cargando datos'
    });
  }
}
