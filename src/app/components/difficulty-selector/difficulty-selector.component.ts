import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DifficultyConfig, DifficultyLevel } from '../../pages/games/puzzle-board/puzzle.game.service';

@Component({
  selector: 'puzzle-difficulty-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './difficulty-selector.component.html',
  styleUrls: ['./difficulty-selector.component.scss']
})
export class DifficultySelectorComponent {
  @Input({ required: true }) configs: DifficultyConfig[] = [];
  @Input({ required: true }) current!: DifficultyLevel;

  @Output() difficultyChange = new EventEmitter<DifficultyLevel>();

  isActive(level: DifficultyLevel) {
    return this.current === level;
  }

  onSelect(level: DifficultyLevel) {
    if (level !== this.current) this.difficultyChange.emit(level);
  }

  // Exponer enum para plantilla si hiciera falta
  protected readonly DifficultyLevel = DifficultyLevel;
}
