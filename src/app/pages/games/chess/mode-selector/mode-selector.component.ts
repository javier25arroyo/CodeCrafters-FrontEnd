import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PlayAgainstComputerDialogComponent } from '../play-against-computer-dialog/play-against-computer-dialog.component';

@Component({
  selector: 'app-chess-mode-selector',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <ng-template #modeTpl>
      <h2 mat-dialog-title>¿Cómo quieres jugar?</h2>
      <mat-dialog-content class="selector-content">
        <button mat-raised-button color="primary" class="mode-btn" (click)="goVsUser()">Usuario vs Usuario</button>
        <button mat-raised-button color="primary" class="mode-btn" (click)="goVsAI()">Jugar vs IA</button>
      </mat-dialog-content>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    .selector-content { display:flex; gap:16px; justify-content:center; }
    .mode-btn { background-color: #0d47a1 !important; color: #fff; }
  `]
})
export class ChessModeSelectorComponent implements AfterViewInit {
  @ViewChild('modeTpl') tpl!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.dialog.open(this.tpl, { disableClose: true }), 0);
  }

  goVsUser() {
    this.dialog.closeAll();
    this.router.navigate(['/chess/user-vs-user']);
  }

  goVsAI() {
  this.dialog.closeAll();
  this.dialog.open(PlayAgainstComputerDialogComponent, { disableClose: true });
  }
}
