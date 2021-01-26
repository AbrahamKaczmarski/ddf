import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ThreadService } from "../thread.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-thread-mgmt',
  templateUrl: './thread-mgmt.component.html',
  styleUrls: ['./thread-mgmt.component.css']
})
export class ThreadMgmtComponent implements OnInit
{
  threads: any = []
  newThreadData: any = {
    name: "",
    coverImage: "",
    description: "Najnowszy wątek."
  }
  editThreadData: any = {
    identifier: "",
    name: "",
    coverImage: "",
    description: ""
  }
  deleteThreadData: any = {
    identifier: "",
    nPosts: 0
  }

  constructor(private _threadService: ThreadService,
              private _router: Router,
              public modal: ModalService) { }

  ngOnInit(): void
  {
    this._threadService.getThreadList()
      .subscribe(
        res => this.threads = res,
        err =>
        {
          if(err instanceof HttpErrorResponse && err.status === 401)
            this._router.navigate(['/'])
        }
      )
  }

  // -- interface

  createThread(): void
  {
    this._threadService.createThread(this.newThreadData)
      .subscribe(
        res => 
        {
          this.newThreadData.name = ""
          this.newThreadData.coverImage = ""
          this.newThreadData.description = "Najnowszy wątek."
          this.ngOnInit()
        },
        err => console.log(err)
      )
  }
  
  editThread(id: string): void
  {
    let thread: any = this.threads.filter((t: any) => t.identifier === id)

    if(!thread.length)
      return

    this.editThreadData.identifier = thread[0].identifier
    this.editThreadData.name = thread[0].name
    this.editThreadData.coverImage = thread[0].coverImage
    this.editThreadData.description = thread[0].description
    
    this.modal.show('modal-edit')
  }

  applyChanges(): void
  {
    this._threadService.editThread(this.editThreadData.identifier, this.editThreadData)
      .subscribe(
        res =>
        {
          this.modal.hide('modal-edit')
          this.ngOnInit()
        },
        err => console.log(err)
      )
  }

  deleteThread(id: string): void
  {
    this.deleteThreadData.identifier = id
    this.deleteThreadData.nPosts = 0
    this.modal.show('modal-delete')
  }

  deleteChosenThread(): void
  {
    this._threadService.deleteThread(this.deleteThreadData.identifier)
      .subscribe(
        res => 
        {
          this.modal.hide('modal-delete')
          this.ngOnInit()
        },
        err => console.log(err)
      )
  }

  // -- utility

  deletingConfirmed(): boolean
  {
    let test: any = this.threads.filter((t: any) => t.identifier === this.deleteThreadData.identifier)
    test = test.length ? test[0] : { nPosts: Infinity }
    return this.deleteThreadData.nPosts == test.nPosts
  }
}
