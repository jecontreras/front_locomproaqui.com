import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { CartAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  
  listCarrito:any = [];
  totalSuma:number = 0;
  constructor(
    private _store: Store<CART>,
    public _tools: ToolsService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCarrito = store.cart || [];
      this.suma();
    });
  }

  ngOnInit(): void {
  }

  suma(){
    this.totalSuma = 0;
    for( let row of this.listCarrito ) this.totalSuma+= row.costoTotal
  }

  updateCart( item:any ){
    let accion = new CartAction( item, 'put');
    this._store.dispatch( accion );
  }

  borrar( idx:any, item:any ){
    this.listCarrito.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
    this.suma();
  }

}
