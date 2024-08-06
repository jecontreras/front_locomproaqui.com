import { Component } from '@angular/core';

@Component({
  selector: 'publico-root',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.scss']
})
export class PublicoComponent {
  constructor(){
    console.log("publico Component")
  }
}
