import { Component, OnInit } from '@angular/core';
import { ThreadService } from "../thread.service";

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {

  public threads: any = []

  constructor(private _threadService: ThreadService) { }

  ngOnInit(): void
  {
    this._threadService.getThreadList()
      .subscribe(
        res => 
        {
          this.threads = res
        },
        err => console.log(err)
      )
  }
}
