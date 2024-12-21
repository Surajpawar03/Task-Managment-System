import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent implements OnInit {
  userForm: any;
  isId: any;
  allUserList: any = [];
  submitted: boolean = false;
  constructor(private fb: FormBuilder, private userServices: UserService,
    private router: Router, private ac: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]*$')]],  // Name validation (letters and spaces only)
      email: ['', [Validators.required, Validators.email]],                    // Email validation
      role: ['', [Validators.required]],                                         // Role validation
      status: ['', [Validators.required]]
    })
    this.isId = this.ac.snapshot.paramMap.get('id');
    if (this.isId) {
      this.userServices.getUserById(this.isId).subscribe((res: any) => {
        this.userForm.setValue({
          name: res.name,
          email: res.email,
          role: res.role,
          status: res.status,
        })
      })

    }
    this.userServices.getUsers().subscribe((res: any) => {
      this.allUserList = res;
    })


  }

  get f() {
    return this.userForm.controls
  }

  onCancel() {
    this.router.navigate(['user/dashboard/user-list']);
  }

  submit() {
    this.submitted = true;
    let checkUser = this.allUserList.filter((item: any) => item.email == this.userForm.value.email);
    if (checkUser.length > 0) {
      Swal.fire({
        title: 'Duplicate Email',
        text: 'Email already exists!',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    else {
      if (this.userForm.invalid) {
        return
      } else {
        if (this.isId != null) {
          this.userServices.updateUser(this.isId, this.userForm.value).subscribe((res: any) => {
            this.router.navigate(['user/dashboard/user-list']);
          })
        } else {
          this.userServices.createUser(this.userForm.value).subscribe((res: any) => {
            this.router.navigate(['user/dashboard/user-list']);
          })
        }
      }

    }
  }
}
