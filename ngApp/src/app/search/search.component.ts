import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ThreadService } from '../thread.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  public profileId: string = ""
  public posts: any = []
  public searchData: any = {
    input: "",
    type: "postContent"
  }

  constructor(private _threadService: ThreadService,
              private _route: ActivatedRoute) { }
            
  ngOnInit(): any
  {
    this._route.paramMap.subscribe((params: ParamMap) =>
    {
      this.profileId = params.get('id') || ""

      this._threadService.searchByProfile(this.profileId)
        .subscribe(
          res => this.posts = res || [],
          err => console.log(err)
        )
    })
  }

  search(): void
  {
    if(this.searchData.input == "")
      return

    this._threadService.searchByInput(this.searchData)
      .subscribe(
        res => this.posts = res || [],
        err => console.log(err)
      )
  }
}
