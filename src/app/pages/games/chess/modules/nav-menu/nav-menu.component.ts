import { ChooseModeDialogComponent } from '../choose-mode-dialog/choose-mode-dialog.component';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button"
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PlayAgainstComputerDialogComponent } from '../play-against-computer-dialog/play-against-computer-dialog.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, MatDialogModule]
})
export class NavMenuComponent {
  constructor(private dialog: MatDialog, private router: Router) {
    // Solo mostrar el modal automáticamente si estamos en /chess o /chess/menu
    setTimeout(() => {
      const currentUrl = this.router.url;
      // Solo mostrar el modal si NO venimos de /chess/against-friend o /chess/against-computer
      if (currentUrl === '/chess' || currentUrl === '/chess/menu') {
        const prev = window.history.state && window.history.state.navigationId > 1 ? document.referrer : '';
        if (prev.includes('/chess/against-friend') || prev.includes('/chess/against-computer')) {
          this.router.navigate(['/game-gallery']);
          return;
        }
        // Mostrar modal de selección de modo
        const dialogRef = this.dialog.open(ChooseModeDialogComponent, { disableClose: true });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'ai') {
            this.dialog.open(PlayAgainstComputerDialogComponent, { disableClose: true });
          } else if (result === 'friend') {
            window.location.pathname = '/chess/against-friend';
          }
        });
      }
    }, 0);
  }

  public playAgainstComputer(): void {
    this.dialog.open(PlayAgainstComputerDialogComponent);
  }
}
