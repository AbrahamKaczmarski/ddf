import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styles: []
})
export class AdminPanelComponent {

  showNav: boolean = true

  constructor() { }

  toggleNav()
  {
    this.showNav = !this.showNav
    console.log(this.showNav)
  }

}
