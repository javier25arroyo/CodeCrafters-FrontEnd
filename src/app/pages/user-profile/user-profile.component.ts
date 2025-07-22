import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
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
  userId!: number;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.userId = user.id!;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          password: '',
          confirmPassword: ''
        });
      },
      error: () => {
        this.errorMessage = 'Error al cargar el perfil.';
      }
    });
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const { name, email, password } = this.profileForm.value;
    const data = { name, email, password };

    this.userService.updateProfile(this.userId, data).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el perfil.';
        this.successMessage = '';
      }
    });
  }

  goToSuggestions() {
    this.router.navigate(['/suggestions']); // 🔁 CORREGIDO: ruta plural
  }
}