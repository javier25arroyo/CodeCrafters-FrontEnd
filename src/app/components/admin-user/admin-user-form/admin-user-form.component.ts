import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IUser } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss']
})
export class AdminUserFormComponent implements OnInit {
  @Input() userToEdit!: IUser;
  @Output() cancel = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  form!: FormGroup;
  

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.userToEdit?.name || '', Validators.required],
      email: [this.userToEdit?.email || '', [Validators.required, Validators.email]],
      active: [this.userToEdit?.active || false]
    });

  }

  submit(): void {
  if (this.form.valid) {
    const updatedUser = {
      id: this.userToEdit.id, // Usamos el ID del usuario seleccionado, aunque no esté en el form
      name: this.form.value.name,
      email: this.form.value.email,
    };

    this.userService.update(updatedUser); 
    alert('Usuario actualizado correctamente');
    this.updated.emit();  
  }
}

  onCancel() {
    this.cancel.emit();
  }
}

