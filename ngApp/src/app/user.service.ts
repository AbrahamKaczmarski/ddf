import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _customProfileUrl = "http://localhost:3000/profile"
  private _userProfileUrl = "http://localhost:3000/profile/user"

  constructor(private http: HttpClient) { }

  getUserProfile()
  {
    return this.http.get<any>(this._userProfileUrl)
  }

  getUserList()
  {
    return this.http.get<any>(this._customProfileUrl)
  }

  getCustomProfile(id: string)
  {
    return this.http.get<any>(`${this._customProfileUrl}/${id}`)
  }

  editUserName(name: string)
  {
    return this.http.patch<any>(this._userProfileUrl, { name })
  }

  editUserRoles(data: any)
  {
    return this.http.patch<any>(this._customProfileUrl, data)
  }
}
