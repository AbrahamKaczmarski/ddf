import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  _displayBackground = true
  _displayUI = true

  constructor(private _authService: AuthService,
              private _router: Router)
  {
    _router.events.subscribe(event =>
      {
        if(event.constructor.name === 'NavigationEnd')
        {
          this._displayBackground = _router.url == "/threads" || _router.url == "/search"
          this._displayUI = !/^\/(login|register)/.test(_router.url)
        }
      })
  }

  // -- flags

  displayBackground() : boolean
  {
    return this._displayBackground
  }

  displayUI() : boolean
  {
    return this._displayUI
  }

  displayRoleUI(role: string) : boolean
  {
    return this._authService.hasRole(role)
  }

  displayProfile() : boolean
  {
    return this._authService.isLoggedIn()
  }

  // -- profile management

  hasRole(role: string): boolean
  {
    return this._authService.hasRole(role)
  }

  getUserName() : string
  {
    let name = this._authService.getUserName()
    return  name === "undefined" ? "" : " " + name
  }

  logout()
  {
    this._authService.logoutUser()
    this.scrollUp()
  }

  // navigation

  scrollDown()
  {
    let top: number = document.getElementById('navbar')?.offsetTop || 0
    top += top ? 1 : 0
    window.requestAnimationFrame(() => { this.scrollStep(window.scrollY, top, 0) })
  }

  scrollUp()
  {
    window.requestAnimationFrame(() => { this.scrollStep(window.scrollY, 0, 0) })
  }

  scrollStep(a: number, b: number, t: number)
  {
    let x = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    window.scrollTo(0, (1 - x) * a + x * b)
    if(t < 1)
      window.requestAnimationFrame(() => { this.scrollStep(a, b, t + 0.025) })
  }
}
