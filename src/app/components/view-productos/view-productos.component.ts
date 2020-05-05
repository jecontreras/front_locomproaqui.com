import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { CartAction } from 'src/app/redux/app.actions';
import { CART } from 'src/app/interfaces/sotarage';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-view-productos',
  templateUrl: './view-productos.component.html',
  styleUrls: ['./view-productos.component.scss']
})
export class ViewProductosComponent implements OnInit {

  data:any = {};
  rango:number = 250;

  constructor(
    public dialogRef: MatDialogRef<ViewProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
    private _tools: ToolsService,
  ) { }

  ngOnInit() {
  
    if(Object.keys(this.datas.datos).length > 0) {
      //console.log(this.datas)
      this.data = _.clone(this.datas.datos);
      this.data.cantidadAdquirir = 1;
      console.log(this.data)
      //this.data.cantidadAdquirir = 1;
    }

  }

  getProducto(){

  }

  descargar(){

  }

  suma( numero:any, cantidad:any ){
    this.data.costo = Number( cantidad ) * Number( numero );
  }
  
  cambioImgs(){
    this.data.foto = this.data.color;
  }

  AgregarCart( opt:any ){
    let color = '';
    let cantidad = this.data.cantidadAdquirir || 1;
    let precio = this.data.pro_uni_venta;
    if( this.data.listColor ) { this.data.color = this.data.listColor.find(row=>row.foto = this.data.foto) || {}; color = this.data.color.talla }
    if(opt) { opt.selecciono = true; this.suma( opt.precios , opt.cantidad ); cantidad = opt.cantidad; precio = opt.precios; }
    else this.suma( this.data.pro_uni_venta , this.data.cantidadAdquirir );
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      color: color,
      talla: this.data.tallas || 'default',
      foto: this.data.foto,
      cantidad: cantidad,
      costo: precio,
      costoTotal: this.data.costo,
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
  }
  
  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
