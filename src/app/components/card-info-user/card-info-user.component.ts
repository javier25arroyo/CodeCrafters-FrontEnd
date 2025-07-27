import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'card-info-user',            
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-info-user.component.html',  
  styleUrls: ['./card-info-user.component.scss'],   
})
export class CardInfoUserComponent {          
  @Input() title: string = '';
  @Input() description?: string;
  @Input() imageUrl?: string;
  @Input() buttonText = 'Acción';
  @Input() routerLink?: string | string[];
  @Output() buttonClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  onButtonClick() {
  if (this.routerLink) {
    if (typeof this.routerLink === 'string') {
      this.router.navigateByUrl(this.routerLink);
    } else {
      this.router.navigate(this.routerLink);
    }
  } else {
    this.buttonClick.emit();
  }
}

}
