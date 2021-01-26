import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit
{
  public error: string = ""
  public registerUserData: any = {
    email: "",
    name: "",
    password: ""
  }
  
  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit(): void{}

  registerUser(): void
  {
    if(!this.registerUserData.email || !this.registerUserData.name || !this.registerUserData.password)
      return

    this._authService.registerUser(this.registerUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('userName', res.name)
          localStorage.setItem('userRoles', res.roles)
          this._router.navigate(['/'])
        },
        err =>
        {
          if(err instanceof HttpErrorResponse && err.status === 409)
            this.error = "Ten adres email jest już zarejestrowany"
        }
      )
  }

}
