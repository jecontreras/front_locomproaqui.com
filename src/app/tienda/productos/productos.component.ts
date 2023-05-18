import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { MatDialog } from '@angular/material';
import { InfoProductoComponent } from '../info-producto/info-producto.component';
import { ProductoHistorialAction, CartAction, BuscadorAction } from 'src/app/redux/app.actions';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormatosService } from 'src/app/services/formatos.service';
import { ChecktDialogComponent } from '../checkt-dialog/checkt-dialog.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  listProductos:any = [];
  query:any = {
    where:{
      pro_activo: 0,
      //pro_categoria: { '!=' : [2,3,12] }
    },
    page: 0,
    limit: 10
  };
  
  listCategorias:any = [];
  dataSeleccionda:string;
  listProductosHistorial: any = [];
  listProductosRecomendar: any = [];

  seartxt:string = '';
  loader:boolean = true;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  busqueda:any = {};

  tiendaInfo:any = {};

  constructor(
    private _productos: ProductoService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _tools: ToolsService,
    public _formato: FormatosService
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.listProductosHistorial = _.orderBy(store.productoHistorial, ['createdAt'], ['DESC']);
      this.tiendaInfo = store.configuracion || {};
      if( store.buscador ) if( Object.keys(store.buscador).length > 0 ) {  if( store.buscador.search ) { this.seartxt = store.buscador.search; this.buscar(); this.borrarBusqueda(); this.dataSeleccionda = store.buscador.search } }
    });
  }

  ngOnInit() {
    this.getProductos();
    this.getCategorias();
    this.getProductosRecomendado();
  }

  getCategorias(){
    this._categorias.get( { where:{ cat_activo: 0 }, limit: 100 } ).subscribe((res:any)=>{ 
      this.listCategorias = res.data;
    });
  }

  SeleccionCategoria( obj:any ){
    this.query = { where:{ pro_activo: 0 }, page: 0, limit: 10 };
    if( obj.id ) this.query.where.pro_categoria = obj.id;
    this.listProductos = [];
    this.getProductos();
    this.dataSeleccionda = obj.cat_nombre;
  }

  searchColor( color:string ){
    this.query.where.color= color; 
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getProductos();
     }
   }

  getProductos(){
    this.spinner.show();
    this._productos.get(this.query).subscribe((res:any)=>{ 
      this.listProductos = _.unionBy(this.listProductos || [], res.data, 'id');
      console.log("******",res)
      this.spinner.hide();
      this.loader = false;
      if (res.data.length === 0 ) {
        this.notEmptyPost =  false;
      }
      this.notscrolly = true;
    }, ( error )=> { console.error(error); this.spinner.hide(); this.loader = false;});
  }

  getProductosRecomendado(){
    this._productos.get( { where:{ pro_activo: 0 }, sort: "createdAt DESC", page: 0, limit: 5 }).subscribe((res:any)=>{ console.log(res); this.listProductosRecomendar = res.data; }, ( error )=> { console.error(error); });
  }
  
  viewProducto( obj:any ){
    const dialogRef = this.dialog.open(InfoProductoComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    let filtro = this.listProductosHistorial.filter( ( row:any ) => row.id == obj.id );
    if(filtro) return false;
    let accion = new ProductoHistorialAction( obj , 'post');
    this._store.dispatch( accion );
  }

  AgregarCart(item:any){
    item.costo = Number( 1 ) * item.pro_uni_venta;
    //this.AgregarCart();
    item.cantidadAd =  1;
    item.talla = 35;
    const dialogRef = this.dialog.open(ChecktDialogComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    /*let data:any = {
      articulo: item.id,
      codigo: item.pro_codigo,
      titulo: item.pro_nombre,
      foto: item.foto,
      talla: item.talla,
      cantidad: item.cantidadAdquirir || 1,
      costo: item.pro_uni_venta,
      costoTotal: ( item.pro_uni_venta*( item.cantidadAdquirir || 1 ) ),
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Agregado al Carro");*/
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  buscar() {
    //console.log(this.seartxt);
    this.loader = true;
    this.seartxt = this.seartxt.trim();
    this.listProductos = [];
    this.notscrolly = true; 
    this.notEmptyPost = true;
    this.query = { where:{ pro_activo: 0 } ,limit: 15, page: 0 };
    if (this.seartxt) {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.seartxt|| ''
          }
        },
        {
          pro_descripcion: {
            contains: this.seartxt|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.seartxt|| ''
          }
        }
      ];
    }
    this.getProductos();
  }
  buscarFiltro( opt:string ){
    this.query = { where:{ pro_activo: 0 } ,limit: 15, page: 0 };
    if(opt == 'ordenar'){
      if(this.busqueda.ordenar == 1){
        this.dataSeleccionda = "";
        delete this.query.sort
      }
      if(this.busqueda.ordenar == 2){
        this.dataSeleccionda = "Ordenar nombre";
        this.query.sort = 'pro_nombre DESC';
      }
      if(this.busqueda.ordenar == 3){
        this.dataSeleccionda = "Ordenar Precio";
        this.query.sort = 'pro_uni_venta DESC';
      }
      if(this.busqueda.ordenar == 3){
        this.dataSeleccionda = "Ordenar Fecha";
        this.query.sort = 'createdAt DESC';
      }
    }
    this.listProductos = [];
    this.loader = true;
    this.getProductos();
  }

  borrarBusqueda(){
    let accion = new BuscadorAction({}, 'drop');
    this._store.dispatch( accion );
  }

}
