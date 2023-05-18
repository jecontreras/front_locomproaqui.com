import { Component, OnInit } from '@angular/core';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  data:any = {};
  empresa:any = {};
  tiendaInfo:any = {};

  constructor(
    private _store: Store<CART>,
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.empresa = store.empresa || {};
      this.tiendaInfo = store.configuracion || {};
    });
  }

  ngOnInit(): void {
  }

  enviarData(){
    let url:string = `https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, le habla ${ this.data.nombre } Email ${ this.data.email } Motivo ${ this.data.sujeto } Compañia ${ this.data.compania } Mensaje ${ this.data.mensaje }`;
    window.open( url );
  }

}
