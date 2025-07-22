import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users$ = this.userService.users$;
  search = this.userService.search;
  totalItems = this.userService.totalItems;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll();
  }

  onDelete(user: IUser) {
    if (confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      this.userService.delete(user);
    }
  }

  onPageChange(page: number) {
    this.userService.search.page = page;
    this.userService.getAll();
  }
}
