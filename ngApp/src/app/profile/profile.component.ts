import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileId: string = ""
  public profile: any = {}
  public rolenames: any = {
    reader: "Czytelnik",
    player: "Gracz",
    gameMaster: "Mistrz Gry",
    admin: "Administrator"
  }
  public newName: string = ""

  constructor(private _userService: UserService,
              private _router: Router,
              private _route: ActivatedRoute,
              public modal: ModalService) { }

  ngOnInit(): void
  {
    this._route.paramMap.subscribe((params: ParamMap) =>
    {
      this.profileId = params.get('id') || ""

      if(!this.profileId)
      {
        this._userService.getUserProfile()
          .subscribe(
            res => this.profile = res,
            err =>
            {
              if(err instanceof HttpErrorResponse && err.status === 401)
                  this._router.navigate(['/login'])
            }
          )
      }
      else
      {
        this._userService.getCustomProfile(this.profileId)
          .subscribe(
            res => this.profile = res,
            err => this.profile = null
          )
      }
    })
  }

  changeName()
  {
    this.newName = this.profile.name
    this.modal.show('modal-changeName')
  }

  confirmNameChange(): void
  {
    this._userService.editUserName(this.newName)
      .subscribe(
        res =>
        {
          this.modal.hide('modal-changeName')
          this.ngOnInit()
        },
        err => console.log(err)
      )
  }
}
