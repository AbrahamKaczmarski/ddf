import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit
{
  public error: string = ""
  public loginUserData: any = {
    login: "",
    password: ""
  }
  returnTo: string = "/"

  constructor(private _auth: AuthService,
              private _router: Router,
              private _route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this._route.queryParams.subscribe(params => this.returnTo = params.returnTo || "/")
  }

  loginUser()
  {
    if(!this.loginUserData.email || !this.loginUserData.password)
      return

    this._auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('userName', res.name)
          localStorage.setItem('userRoles', res.roles)
          this._router.navigate([this.returnTo])
        },
        err =>
        {
          if(err instanceof HttpErrorResponse && err.status === 401)
            this.error = "Błędny adres email lub hasło"
        }
      )
  }

}
