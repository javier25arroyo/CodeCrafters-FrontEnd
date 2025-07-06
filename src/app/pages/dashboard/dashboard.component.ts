import { Component, OnInit } from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  isSuperAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole("SUPER_ADMIN");
  }
}
