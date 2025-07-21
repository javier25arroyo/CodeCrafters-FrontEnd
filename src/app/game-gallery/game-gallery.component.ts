import { Component } from "@angular/core";
import { RouterLink } from '@angular/router';
import { CardInfoGameComponent } from "../components/card-info-game/card-info-game.component";
import { DailyTipComponent } from "../components/daily-tip/daily-tip.component";

@Component({
  selector: "app-game-gallery",
  standalone: true,
  imports: [CardInfoGameComponent, DailyTipComponent, RouterLink],
  templateUrl: "./game-gallery.component.html",
  styleUrls: ["./game-gallery.component.scss"],
})
export class GameGalleryComponent {
}
