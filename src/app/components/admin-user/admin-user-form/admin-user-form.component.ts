import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.findById(this.userId).subscribe((user: IUser) => {
        this.form.patchValue({
          name: user.name,
          email: user.email,
          role: user.role?.id,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const user: IUser = this.form.value;

    if (this.userId) {
      user.id = +this.userId;
      this.userService.update(user);
    } else {
      this.userService.save(user);
    }

    this.router.navigate(['/admin/users']);
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
