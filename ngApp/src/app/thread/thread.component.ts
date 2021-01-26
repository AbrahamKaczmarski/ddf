import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { AuthService } from '../auth.service';
import { ThreadService } from '../thread.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit
{
  public threadTitle: string = ""
  public threadIdentifier: string = ""
  public page: number = 1
  public pageLimit: number = 1
  public posts: any = []
  public newPostData: any = {}

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _authService: AuthService,
              private _threadService: ThreadService) { }

  ngOnInit(): void
  {
    this._route.paramMap.subscribe((params: ParamMap) =>
    {
      this.threadIdentifier = params.get('id') || ""
      this.page = parseInt(params.get('page') || "1")

      this._threadService.getThread(this.threadIdentifier, this.page)
        .subscribe(
          res =>
          {
            this.threadTitle = res.threadTitle
            this.pageLimit = Math.ceil(res.nPosts / 10) || 1
            this.posts = res.posts
          },
          err => console.log(err)
        )
    })
  }

  // -- flags

  hasRole(role: string): boolean
  {
    return this._authService.hasRole(role)
  }

  // -- interface

  addPost(): void
  {
    let newPostData = { content: this.newPostData.content }

    this._threadService.addPost(this.threadIdentifier, newPostData)
      .subscribe(
        res => {
          this.newPostData.content = ""
          this.ngOnInit()
        },
        err => console.log(err)
      )
  }

  deletePost(id: string): void
  {
    this._threadService.deletePost(id)
      .subscribe(
        res => this.ngOnInit(),
        err => console.log(err)
      )
  }

  // -- navigation

  previousPage()
  {
    this._router.navigate([`/threads/${this.threadIdentifier}/${this.page - 1}`])
  }

  nextPage()
  {
    this._router.navigate([`/threads/${this.threadIdentifier}/${this.page + 1}`])
  }
}
