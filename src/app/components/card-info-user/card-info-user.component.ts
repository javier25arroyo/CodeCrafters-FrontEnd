import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  @Input() routerLink?: string;
  @Output() buttonClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  onButtonClick() {
    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    } else {
      this.buttonClick.emit();
    }
  }
}
