import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { CartAction } from 'src/app/redux/app.actions';
import { CART } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-view-productos',
  templateUrl: './view-productos.component.html',
  styleUrls: ['./view-productos.component.scss']
})
export class ViewProductosComponent implements OnInit {

  data:any = {};
  rango:number = 100;

  constructor(
    public dialogRef: MatDialogRef<ViewProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
  ) { }

  ngOnInit() {
  
    if(Object.keys(this.datas.datos).length > 0) {
      console.log(this.datas)
      this.data = this.datas.datos;
      //this.data.cantidadAdquirir = 1;
    }

  }

  getProducto(){

  }

  descargar(){

  }

  suma(){
    this.data.costo = this.data.cantidadAdquirir * this.data.pro_uni_venta;
  }

  AgregarCart(){
    this.suma();
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      foto: this.data.foto,
      cantidad: this.data.cantidadAdquirir || 1,
      costo: this.data.pro_uni_venta,
      costoTotal: this.data.costo,
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
  }
  
  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
