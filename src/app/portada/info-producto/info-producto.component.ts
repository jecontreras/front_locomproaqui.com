import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { CartAction, SeleccionCategoriaAction } from 'src/app/redux/app.actions';
import * as _ from 'lodash';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-info-producto',
  templateUrl: './info-producto.component.html',
  styleUrls: ['./info-producto.component.scss']
})
export class InfoProductoComponent implements OnInit {
  data:any= {};
  pedido:any = { cantidad: 1};
  dataUser:any = {};
  userId:any = {};
  urlwhat:string;
  tiendaInfo:any = {};

  constructor(
    public dialogRef: MatDialogRef<InfoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
    private _tools: ToolsService,
    private dialog: MatDialog,
    public _formato: FormatosService,
    private Router: Router
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.tiendaInfo = store.configuracion || {};
    });
  }

  ngOnInit(): void {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = this.datas.datos;
      console.log(this.data);
    }
  }
  
  suma(){
    this.data.costo = Number( this.pedido.cantidad ) * this.data.pro_uni_venta;
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  categoriasVer(){
    let accion = new SeleccionCategoriaAction( this.data.pro_categoria, 'post');
    this._store.dispatch(accion);
    this.dialog.closeAll();
  }

  AgregarCart(){
    this.suma();
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      color: "",
      talla: this.pedido.talla,
      foto: this.data.foto,
      cantidad: this.pedido.cantidad || 1,
      costo: this.data.pro_uni_venta,
      costoTotal: this.data.costo,
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
  }

  masInfo(obj:any){
    obj.talla = this.pedido.talla;
    obj.cantidad = this.pedido.cantidad || 1;
    let cerialNumero:any = ''; 
    let numeroSplit:any;
    let cabeza:any = this.dataUser.cabeza;
    if( cabeza ){
      numeroSplit = _.split( cabeza.usu_telefono, "+57", 2);
      if( numeroSplit[1] ) cabeza.usu_telefono = numeroSplit[1];
      if( cabeza.usu_perfil == 3 ) cerialNumero = ( cabeza.usu_indicativo || '57' ) + ( cabeza.usu_telefono || '3208429429' );
      else cerialNumero = "57"+this.validarNumero();
    }else cerialNumero = "57"+this.validarNumero();
    if(this.userId.id) this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ ( (_.split( this.userId.usu_telefono , "+57", 2))[1] ) || '3208429429'}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} foto ==> ${ obj.foto } Talla: ${ obj.talla || 'default' }`;
    else {
      this.urlwhat = `https://wa.me/${ cerialNumero }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} foto ==> ${ obj.foto } Talla: ${ obj.talla || 'default'}`;
    }
    window.open(this.urlwhat);
  }

  comprarArticulo( ){
    this.AgregarCart();
    this.Router.navigate( ['tienda/carrito'] );
  }

  validarNumero(){
    return "3208429429";
  }

}
