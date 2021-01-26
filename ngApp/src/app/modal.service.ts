import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  show(id: string): void
  {
    document.getElementById(id)?.classList.remove('modal--collapsed')
  }

  hide(id: string): void
  {
    document.getElementById(id)?.classList.add('modal--collapsed')
  }

  stopPropagation(event: any): void
  {
    event.stopPropagation()
  }
}
