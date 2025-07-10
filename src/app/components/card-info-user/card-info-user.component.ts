import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'card-info-user',            
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info-user.component.html',  
  styleUrls: ['./card-info-user.component.scss'],   
})
export class CardInfoUserComponent {          
  @Input() title: string = '';
  @Input() description?: string;
  @Input() imageUrl?: string;
  @Input() buttonText: string = 'Acción';
  @Output() buttonClick = new EventEmitter<void>();
}
