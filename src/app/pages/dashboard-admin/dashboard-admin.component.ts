import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DailyTipComponent } from '../../components/daily-tip/daily-tip.component';
import { CardInfoUserComponent } from '../../components/card-info-user/card-info-user.component';
import { NavAdminComponent } from '../../components/nav-admin/nav-admin.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    DailyTipComponent,
    CardInfoUserComponent,
    NavAdminComponent
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('600ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DashboardAdminComponent {
 
}
