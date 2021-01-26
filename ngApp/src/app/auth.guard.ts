import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private _authService: AuthService,
              private _router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  {
    try
    {
      await this._authService.verifyAccess(route.data.roles || []).toPromise()
      return true
    }
    catch
    {
      if(!this._authService.isLoggedIn())
        this._router.navigate(['/login'], { queryParams: { returnTo: state.url } })
      else
        this._router.navigate(['/'])
        
      return false
    }
  }

}
