import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { StockfishService } from '../computer-mode/stockfish.service';
import { Color } from '../../chess-logic/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-play-against-computer-dialog',
  templateUrl: './play-against-computer-dialog.component.html',
  styleUrls: ['./play-against-computer-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class PlayAgainstComputerDialogComponent {
  public levels = [
    { label: 'Fácil', value: 1 },
    { label: 'Medio', value: 3 },
    { label: 'Difícil', value: 5 }
  ];
  public stockfishLevel: number = 1;

  constructor(
    private stockfishService: StockfishService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  public selectStockfishLevel(level: number): void {
    this.stockfishLevel = level;
  }

  public play(color: "w" | "b"): void {
    this.dialog.closeAll();
    // El color seleccionado es el color del usuario, la IA debe ser el opuesto
    const iaColor = color === "w" ? Color.Black : Color.White;
    this.stockfishService.computerConfiguration$.next({
      color: iaColor,
      level: this.stockfishLevel
    });
    // Navega a la partida contra la IA, el primer movimiento lo maneja ComputerModeComponent
    this.router.navigate(["chess", "against-computer"]);
  }

  // Método closeDialog eliminado, ya no es necesario
}
