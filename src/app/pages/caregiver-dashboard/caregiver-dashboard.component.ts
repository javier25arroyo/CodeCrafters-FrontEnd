import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { CaregiverService }     from '../../services/caregiver.service';
import { AuthService }          from '../../services/auth.service';
import { IUserCaregiver }       from '../../interfaces';
import { HttpClientModule }     from '@angular/common/http';
import { RouterLink }           from '@angular/router';
import { NavComponent } from "../../components/nav/nav.component";
import { CardInfoUserComponent } from "../../components/card-info-user/card-info-user.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-caregiver-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, NavComponent, CardInfoUserComponent, FooterComponent],
  templateUrl: './caregiver-dashboard.component.html',
  styleUrls: ['./caregiver-dashboard.component.scss'],
  animations: [
      trigger("fadeInOut", [
        transition(":enter", [
          style({ opacity: 0 }),
          animate("600ms ease-in", style({ opacity: 1 })),
        ]),
        transition(":leave", [animate("600ms ease-out", style({ opacity: 0 }))]),
      ]),
    ],
  })

export class CaregiverDashboardComponent{
}
