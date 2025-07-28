import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CardInfoUserComponent } from "../../components/card-info-user/card-info-user.component";
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IRoleType } from '../../interfaces';

@Component({
  selector: 'app-caregiver-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardInfoUserComponent,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './caregiver-dashboard.component.html',
  styleUrls: ['./caregiver-dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ]),
    ]),
  ],
})
export class CaregiverDashboardComponent implements OnInit {
  public IRoleType = IRoleType;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
