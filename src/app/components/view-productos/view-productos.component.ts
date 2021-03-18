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
  urlwhat: string
  userId: any;
  dataUser:any = {};
  urlFoto:string;
  galeria:any = [];

  constructor(
    public dialogRef: MatDialogRef<ViewProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
    private _tools: ToolsService,
  ) { 

    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.userId = store.usercabeza;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
  
    if(Object.keys(this.datas.datos).length > 0) {
      //console.log(this.datas)
      this.data = _.clone(this.datas.datos);
      this.galeria = _.clone( this.data.listaGaleria || [] );
      this.data.cantidadAdquirir = 1;
      this.urlFoto = this.data.foto;
      if( !this.galeria ) this.galeria || [];
      this.galeria.push( {
        id: this._tools.codigo(),
        foto: this.data.foto
      });
      console.log(this.data)
      //this.data.cantidadAdquirir = 1;
    }

  }

  ngOnDestroy(){
    console.log("saliendo", this.data, this.datas.datos );
  }

  seleccionFoto( foto:string ){
    this.urlFoto = foto;
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

  masInfo(obj: any) {
    console.log( obj );
    let cerialNumero: any = '';
    let numeroSplit: any;
    let cabeza: any = this.dataUser.cabeza;
    if (!obj.tallas) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    if (cabeza) {
      numeroSplit = _.split(cabeza.usu_telefono, "+57", 2);
      if (numeroSplit[1]) cabeza.usu_telefono = numeroSplit[1];
      if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || '3148487506');
      else cerialNumero = "573148487506";
    } else cerialNumero = "573148487506";
    if (this.userId.id) this.urlwhat = `https://wa.me/${this.userId.usu_indicativo || 57}${((_.split(this.userId.usu_telefono, "+57", 2))[1]) || '3148487506'}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} codigo: ${obj.pro_codigo} talla: ${obj.tallas} foto ==> ${obj.foto}`;
    else {
      this.urlwhat = `https://wa.me/${cerialNumero}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo: ${obj.pro_codigo} talla: ${obj.tallas} foto ==> ${obj.foto}`;
    }
    window.open(this.urlwhat);
  }

}
