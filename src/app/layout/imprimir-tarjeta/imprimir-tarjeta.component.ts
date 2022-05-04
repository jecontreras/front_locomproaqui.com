import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { STORAGES } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-imprimir-tarjeta',
  templateUrl: './imprimir-tarjeta.component.html',
  styleUrls: ['./imprimir-tarjeta.component.scss']
})
export class ImprimirTarjetaComponent implements OnInit {
  data:any = {};
  constructor(
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.data = store.user;
      this.data.usu_nombre1 = ( this.data.usu_nombre || "" ) + " " + ( this.data.usu_apellido || "" );
    });
   }

  ngOnInit(): void {
    this.data.createdAt = moment( this.data.createdAt ).format("DD/MM/YYYY");
    //window.print();
  }

}
