import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserFormComponent } from '../../components/admin-user/admin-user-form/admin-user-form.component';
import { AdminUserListComponent } from '../../components/admin-user/admin-user-list/admin-user-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { AdminGameListComponent } from '../../components/games/game-list/admin-game-list.component';
import { NavAdminComponent } from '../../components/nav-admin/nav-admin.component';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    AdminUserFormComponent,
    AdminUserListComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminGameListComponent,
    NavAdminComponent,
    FooterComponent
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss'],
})
export class AdminUserManagementComponent {
  selectedUser: IUser | null = null;
  users: IUser[] = [];
  

  constructor(private userService: UserService) {}

  ngOnInit(): void {
  this.loadUsers();
}


  onEditUser(user: IUser) {
    this.selectedUser = user;
  }

  onCancelEdit() {
    this.selectedUser = null;
  }

 onUserUpdated(): void {
    this.loadUsers(); // Recarga la tabla
    this.selectedUser = null;
}


  loadUsers(): void {
    this.userService.findAllWithParams({ page: 1, size: 100, filter: '' }).subscribe({
      next: (response: any) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }
}
