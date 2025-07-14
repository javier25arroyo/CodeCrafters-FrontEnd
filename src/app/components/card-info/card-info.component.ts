import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'card-info',            
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info.component.html',  
  styleUrls: ['./card-info.component.scss'],   
})
export class CardInfoComponent {          
  @Input() title: string = '';
  @Input() description?: string;
  @Input() imageUrl?: string;
  @Input() buttonText: string = 'Acción';
  @Output() buttonClick = new EventEmitter<void>();
}
