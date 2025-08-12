import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-result-dialog',
  templateUrl: './chess-result-dialog.component.html',
  styleUrls: ['./chess-result-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class ChessResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChessResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { winner: string, reason: string }
  ) {}

  translateReason(reason: string): string {
    if (!reason) return '';
    let r = reason;
    r = r.replace(/Black won by checkmate/i, 'Negras ganan por jaque mate');
    r = r.replace(/White won by checkmate/i, 'Blancas ganan por jaque mate');
    r = r.replace(/Stalemate/i, 'Tablas por ahogado');
    r = r.replace(/Draw/i, 'Tablas');
    r = r.replace(/by checkmate/i, 'por jaque mate');
    r = r.replace(/by stalemate/i, 'por ahogado');
    r = r.replace(/won by resignation/i, 'gana por rendición');
    r = r.replace(/Black won/i, 'Negras ganan');
    r = r.replace(/White won/i, 'Blancas ganan');
    r = r.replace(/by resignation/i, 'por rendición');
    r = r.replace(/by timeout/i, 'por tiempo');
    r = r.replace(/by draw/i, 'por tablas');
    return r;
  }

  close(): void {
    this.dialogRef.close();
  }
}
