import { Component } from '@angular/core';

@Component({
  selector: 'tienda-root',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent {
  constructor(){
    console.log("Tienda Component")
  }
}
