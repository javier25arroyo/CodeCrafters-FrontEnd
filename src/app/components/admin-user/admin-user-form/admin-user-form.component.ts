// admin-user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './admin-user-form.component.html',
})
export class AdminUserFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.userId = +id;
        this.loadUser(this.userId);
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      }
    });
  }

 loadUser(id: number): void {
  const users = this.userService.users$(); 
  const user = users.find(u => u.id === id);
  if (user) {
    this.form.patchValue({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role?.name,
    });
  }
}

  submit(): void {
    if (this.form.invalid) return;

    const userData: IUser = this.form.value;

    if (this.isEdit && this.userId) {
      userData.id = this.userId;
      this.userService.update(userData);
    } else {
      this.userService.save(userData);
    }

    this.router.navigate(['/app/users']);
  }
}
