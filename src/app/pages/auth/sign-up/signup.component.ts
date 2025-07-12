import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  public passwordFieldType: string = 'password';
  public imagePreview: string | null = null;
  public imageError: string | null = null;
  public selectedFile: File | null = null;
  public confirmPasswordValue: string = '';

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('confirmPassword') confirmPasswordModel!: NgModel;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public user: IUser = {};

  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    this.imageError = null;
    
    if (!file) {
      this.clearImage();
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please select a valid image file';
      this.clearImage();
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.imageError = 'Image size must be less than 5MB';
      this.clearImage();
      return;
    }

    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  public removeImage(): void {
    this.clearImage();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imageError = null;
  }

  public passwordsMatch(): boolean {
    return this.user.password === this.confirmPasswordValue;
  }

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (!this.confirmPasswordModel.valid) {
      this.confirmPasswordModel.control.markAsTouched();
    }
    
    if (this.nameModel.valid && this.emailModel.valid && this.passwordModel.valid && this.confirmPasswordModel.valid && this.passwordsMatch()) {
      if (this.selectedFile) {
        this.authService.signupWithImage(this.user, this.selectedFile).subscribe({
          next: () => this.validSignup = true,
          error: (err: any) => (this.signUpError = err.description || err.message),
        });
      } else {
        this.authService.signup(this.user).subscribe({
          next: () => this.validSignup = true,
          error: (err: any) => (this.signUpError = err.description || err.message),
        });
      }
    }
  }
}
