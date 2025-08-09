import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'] 
})
export class AdminUserListComponent implements OnInit {
  @Output() editUser = new EventEmitter<IUser>();
  @Input() users: IUser[] = [];
  
  currentUserRole: string = '';
  search = { filter: '', page: 1, size: 5, totalPages: 0 };
  totalPagesArray: number[] = [];
  loading = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.userService.getCurrentUserRole();
    this.loadUsers();
    
  }


loadUsers(): void {
  this.loading = true;
  this.userService.findAllWithParams({
    page: this.search.page,
    size: this.search.size,
    filter: this.search.filter,
  }).subscribe({
    next: (response: any) => {
      this.users = response.data;
      this.search.totalPages = response.meta.totalPages;
      this.totalPagesArray = Array.from({ length: this.search.totalPages }, (_, i) => i + 1);
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.alertService.displayAlert('error', 'Error cargando usuarios');
    }
  });
}

  onSearch(): void {
    this.search.page = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    if (this.loading) return;
    this.search.page = page;
    this.loadUsers();
  }

  goToeditUser(user: IUser): void {
  if (!user.id) {
    this.alertService.displayAlert('error', 'Usuario sin ID válido');
    return;
  }
  this.router.navigate(['/app/users/edit', user.id]); 
}

  deleteUser(user: IUser): void {
  if (!user.id) {
    this.alertService.displayAlert('error', 'Usuario sin ID válido');
    return;
  }
  this.userService.delete(user); 
}

toggleUserActive(user: IUser): void {
  if (!user.id) return;

  this.userService.toggleEnabled(user.id).subscribe({
    next: (response: any) => {
      this.alertService.displayAlert('success', response.message || 'Estado actualizado');
      user.active = !user.active;
    },
    error: () => {
      this.alertService.displayAlert('error', 'Error al actualizar el estado');
    }
  });
}

onEditClick(user: IUser) {
    this.editUser.emit(user);
  }

  
}
