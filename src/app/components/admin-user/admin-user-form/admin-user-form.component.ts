import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IUser, IRole } from '../../../interfaces';
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

 roles = [
  { name: 'ROLE_ADMIN', description: 'Administrador' },
  { name: 'ROLE_USER', description: 'Usuario' },
  { name: 'ROLE_SUPER_ADMIN', description: 'Super Administrador' },
];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [null, Validators.required],  // role como objeto completo
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.userId = +id;
        this.loadUser(this.userId);
        // En edición, contraseña no es requerida
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
        email: user.email,
        password: '',  // opcional limpiar contraseña al editar
        role: this.roles.find(r => r.name === user.role?.name) || null,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    // Construimos usuario para backend con role objeto completo
    const userData: IUser = {
      ...formValue,
      role: formValue.role,  // role ya es objeto IRole completo
    };

    if (this.isEdit && this.userId) {
      userData.id = this.userId;
      this.userService.update(userData);
    } else {
      this.userService.save(userData);
    }

    this.router.navigate(['/app/users']);
  }
}
