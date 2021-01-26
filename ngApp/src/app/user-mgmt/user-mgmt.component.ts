import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styles: []
})
export class UserMgmtComponent implements OnInit {

  public users: any = []
  public userMask: string = ""

  constructor(private _userService: UserService) { }

  ngOnInit(): void
  {
    this._userService.getUserList()
      .subscribe(
        res =>
        {
          this.users = res
          for(let user of this.users)
          {
            user.updated = false
            user.privileges = {
              reader: user.roles.includes('reader'),
              player: user.roles.includes('player'),
              gameMaster: user.roles.includes('gameMaster'),
              admin: user.roles.includes('admin')
            }
          }
        },
        err => console.log(err)
      )
  }

  // -- flags

  needToSave(): boolean
  {
    for(let user of this.users)
    {
      if(user.updated)
        return true
    }

    return false
  }

  hideUser(user: any): boolean
  {
    const mask = this.userMask
    return mask != "" && !user.name.includes(mask) && !user.email.includes(mask)
  }

  // -- interface

  saveChanges(): void
  {
    let changedUsers = this.users.filter((user: any) => user.updated)

    for(let user of changedUsers)
    {
      user.roles = []
      for(let role in user.privileges)
      {
        if(user.privileges[role])
          user.roles.push(role)
      }
    }

    let changes = changedUsers.map((user: any) => { return { id: user._id, roles: user.roles } })

    this._userService.editUserRoles(changes)
      .subscribe(
        res => this.ngOnInit(),
        err => console.log(err)
      )
  }

  // -- utility

  checkUpdates(user: any): void
  {
    for(let role in user.privileges)
    {
      if(user.privileges[role] != user.roles.includes(role))
      {
        user.updated = true
        return
      }
    }

    user.updated = false
  }
}
