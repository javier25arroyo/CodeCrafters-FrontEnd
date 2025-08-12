import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-mode-dialog',
  templateUrl: './choose-mode-dialog.component.html',
  styleUrls: ['./choose-mode-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ChooseModeDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ChooseModeDialogComponent>,
    private router: Router
  ) {}

  public chooseFriend(): void {
    this.dialogRef.close('friend');
    // La navegación se hará en el componente padre después de cerrar el modal
  }

  public chooseAI(): void {
    this.dialogRef.close('ai');
  }
}
