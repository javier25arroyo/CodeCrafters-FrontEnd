import { Component } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { DailyTipComponent } from '../daily-tip/daily-tip.component';


@Component({
  selector: "app-dashboard-usuario",
  imports: [ DailyTipComponent],
  templateUrl: "./dashboard-usuario.component.html",
  styleUrls: ["./dashboard-usuario.component.scss"],
  standalone: true,
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
