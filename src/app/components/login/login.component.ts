import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { AuthService } from '../../shared/auth/auth.service';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  showLoader = false;
  loginError = false;
  failedMessage = '';
  ipAddress = '';
  loginResponse = '';
  userLoginForm: any;
  userNameFormControl: any;
  userPasswordControl: any;
  currentYear: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private common: CommonService,
    public dialog: MatDialog,
    private https: HttpClient
  ) {
    this.buildLoginForm();
    if (this.auth.loggedIns())
      this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void { }

  getIPAddress() {
    this.https.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  buildLoginForm() {
    this.userLoginForm = this.fb.group({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', Validators.required)
    });
    this.userNameFormControl = this.userLoginForm.get('email') as FormControl;
    this.userPasswordControl = this.userLoginForm.get('password') as FormControl;
  }

  submitLoginForm() {
    const data = this.userLoginForm.value;
    this.auth.login(data);
    this.showLoader = true;
    this.auth.login(data).subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.showLoader = false;
          let token = res.data.token;
          const cvalue = { 'bearertoken': token }
          const cvalue2 = res.data.permissions;
          this.common.permissionsAll = res.data.all_componet_permission;
          let env = this.common.environmentObj
          this.auth.setCookie(env.tokenKey, encodeURIComponent(JSON.stringify(cvalue)), 10);
          localStorage.setItem(env.componentGroupPermission, encodeURIComponent(JSON.stringify(cvalue2)));
          localStorage.setItem(env.allComponentPermission, encodeURIComponent(JSON.stringify(res.data.all_componet_permission)));
          localStorage.setItem(env.roleType, encodeURIComponent(JSON.stringify(res.data.role_type)));
          this.loginResponse = 'success';
          this.router.navigate(['dashboard']);

          if (!res) {
            this.loginResponse = 'error';
            this.loginError = true;
          }
        }
        else {
          this.common.openSnackBar(res.message, 'Close', 'submit-warning');
        }

      },
      error: (error) => {
        console.error("login error:", error)
        this.showLoader = false;
        this.loginError = true;
      }
    });
  }

}
