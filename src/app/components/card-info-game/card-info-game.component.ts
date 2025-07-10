import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "card-info-game",
  standalone: true,
  imports: [CommonModule], // <-- ¡ESTO ES LO QUE FALTA!
  templateUrl: "./card-info-game.component.html",
  styleUrls: ["./card-info-game.component.scss"],
})
export class CardInfoGameComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
  @Input() buttonText!: string;
}