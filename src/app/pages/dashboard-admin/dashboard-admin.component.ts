import { Component } from "@angular/core";
import { DailyTipComponent } from "../../components/daily-tip/daily-tip.component";
import { CardInfoComponent } from "../../components/card-info/card-info.component";

@Component({
  selector: "app-dashboard-admin",
  standalone: true,
  imports: [DailyTipComponent, CardInfoComponent],
  templateUrl: "./dashboard-admin.component.html",
  styleUrls: ["./dashboard-admin.component.scss"],
})
export class DashboardAdminComponent {}
