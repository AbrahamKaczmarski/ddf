import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _registerUrl = "http://localhost:3000/register"
  private _loginUrl = "http://localhost:3000/login"
  private _verifyUrl = "http://localhost:3000/verify"

  constructor(private http: HttpClient,
              private _router: Router) { }

  registerUser(user: any)
  {
    return this.http.post<any>(this._registerUrl, user)
  }

  loginUser(user: any)
  {
    return this.http.post<any>(this._loginUrl, user)
  }

  logoutUser()
  {
    localStorage.removeItem('userName')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('token')
    this._router.navigate(['/'])
  }

  isLoggedIn()
  {
    return !!localStorage.getItem('token')
  }

  hasRole(role: string)
  {
    return !!localStorage.getItem('userRoles')?.includes(role)
  }

  verifyAccess(roles: [string])
  {
    return this.http.post<any>(this._verifyUrl, roles)
  }

  getToken()
  {
    return localStorage.getItem('token')
  }

  getUserName()
  {
    return localStorage.getItem('userName') || "undefined"
  }
}
