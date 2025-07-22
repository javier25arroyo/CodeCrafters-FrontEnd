import { Component } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { DailyTipComponent } from "../daily-tip/daily-tip.component";
import { CardInfoUserComponent } from "../card-info-user/card-info-user.component";
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "app-dashboard-usuario",
  standalone: true,
  imports: [
    DailyTipComponent,
    CardInfoUserComponent,
    NavComponent,
    FooterComponent
  ],
  templateUrl: "./dashboard-usuario.component.html",
  styleUrls: ["./dashboard-usuario.component.scss"],
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
export class DashboardUsuarioComponent {}
