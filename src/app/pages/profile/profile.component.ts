import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../components/nav/nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, NavComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public profileService = inject(ProfileService);

  constructor() {
    this.profileService.getUserInfoSignal();
  }
}
