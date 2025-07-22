import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from '../../components/nav/nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  profileForm!: FormGroup;
  errorMessage = '';

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }]
    });

    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      },
      error: () => {
        this.errorMessage = 'Error al cargar el perfil.';
      }
    });
  }

  goToSuggestions() {
    this.router.navigate(['/suggestions']);
  }
}
