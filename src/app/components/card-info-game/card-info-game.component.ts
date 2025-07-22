import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "card-info-game",
  standalone: true,
  imports: [CommonModule], 
  templateUrl: "./card-info-game.component.html",
  styleUrls: ["./card-info-game.component.scss"],
})
export class CardInfoGameComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
  @Input() buttonText!: string;
  @Input() routerLink?: string;

  constructor(private router: Router) {}

  onCardClick() {
    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    }
  }
}