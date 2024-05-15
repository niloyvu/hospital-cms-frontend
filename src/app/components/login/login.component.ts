import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showLoader: boolean = false;
  failedMessage: string = '';
  userLoginForm!: FormGroup;
  currentYear: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.buildLoginForm();
    if (this.authService.loggedIns())
      this.router.navigate(['/dashboard']);
  }

  buildLoginForm() {
    this.userLoginForm = this.fb.group({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', Validators.required)
    });
  }

  submitLoginForm() {
    this.showLoader = true;
    const data = this.userLoginForm.value;
    this.authService.login(data).subscribe({
      next: (res) => {
        this.showLoader = false;
        if (res.code == 200) {
          let token = res.data.token;
          const cookieValue = { 'bearertoken': token }
          const localStorageValue = res.data.permissions;
          this.commonService.permissionsAll = res.data.all_componet_permission;
          let env = this.commonService.environmentObj
          this.authService.setCookie(env.tokenKey, encodeURIComponent(JSON.stringify(cookieValue)), 10);
          localStorage.setItem(env.componentGroupPermission, encodeURIComponent(JSON.stringify(localStorageValue)));
          localStorage.setItem(env.allComponentPermission, encodeURIComponent(JSON.stringify(res.data.all_componet_permission)));
          localStorage.setItem(env.roleType, encodeURIComponent(JSON.stringify(res.data.role_type)));
          this.router.navigate(['dashboard']);
        }
        else {
          this.failedMessage = 'Failed to login try again!';
          this.commonService.openSnackBar(res.message, 'Close', 'submit-warning');
        }

      },
      error: (error) => {
        console.error("login error:", error)
        this.showLoader = false;
        this.failedMessage = 'Failed to login try again!';
      }
    });
  }

}
