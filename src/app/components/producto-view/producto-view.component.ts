import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { ToolsService } from 'src/app/services/tools.service';
import { CartAction } from 'src/app/redux/app.actions';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-producto-view',
  templateUrl: './producto-view.component.html',
  styleUrls: ['./producto-view.component.scss']
})
export class ProductoViewComponent implements OnInit {

  data:any = {};
  rango:number = 250;
  id:any;

  constructor(
    private activate: ActivatedRoute,
    private _producto: ProductoService,
    private _tools: ToolsService,
    private _store: Store<CART>,
  ) { }

  ngOnInit() {
    if((this.activate.snapshot.paramMap.get('id'))){
      this.id = this.activate.snapshot.paramMap.get('id');
      this.getProducto();
    }
  }

  getProducto(){
    this._producto.get({ where: { id: this.id}}).subscribe((res:any)=>{ this.data = res.data[0] || {}; this.data.cantidadAdquirir = 1; }, error=> { console.error(error); this._tools.presentToast('Error de servidor'); });
  }

  descargar(){

  }

  suma(){
    this.data.costo = this.data.cantidadAdquirir * this.data.pro_uni_venta;
  }
  cambioImgs(){
    this.data.foto = this.data.color;
  }

  AgregarCart(){
    let color = '';
    if( this.data.listColor ) { this.data.color = this.data.listColor.find(row=>row.foto = this.data.foto) || {}; color = this.data.color.talla }
    this.suma();
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      foto: this.data.foto,
      color: color,
      cantidad: this.data.cantidadAdquirir || 1,
      costo: this.data.pro_uni_venta,
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
