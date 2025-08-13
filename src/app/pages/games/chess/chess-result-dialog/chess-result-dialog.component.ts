import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type DialogData = { message: string };

@Component({
  selector: 'app-chess-result-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="custom-modal">
      <h2 mat-dialog-title>Game Over</h2>
      <mat-dialog-content>
        <div *ngIf="data.message === 'Winner: AI'" class="robot-emote" aria-label="robot">🤖</div>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrls: ['./chess-result-dialog.component.css']
})
export class ChessResultDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
