import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { MatBottomSheet, MatBottomSheetRef, MatDialog } from '@angular/material';
import { InfoProductoComponent } from '../info-producto/info-producto.component';
import { ProductoHistorialAction, CartAction, BuscadorAction, UserCabezaAction, CategoriaAction } from 'src/app/redux/app.actions';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormatosService } from 'src/app/services/formatos.service';
import { ChecktDialogComponent } from '../checkt-dialog/checkt-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
let listCategory = [];
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
    limit: 30
  };

  listCategorias:any = [];
  dataSeleccionda:string;
  listProductosHistorial: any = [];
  listProductosRecomendar: any = [];

  seartxt:string = '';
  loader:boolean = true;
  notscrolly:boolean=false;
  notEmptyPost:boolean = false;
  busqueda:any = {
    orderBy: ""
  };

  tiendaInfo:any = {};
  id:string;
  dataUser:any = {};
  userCabeza:any = {};
  @ViewChild('toolbar',{static: false} ) private nav: any;
  userId:any;
  breakpoint: number = 6;
  listBanner: any = [  ];
  public mobileQuery: any;
  private _mobileQueryListener: () => void;
  events: string[] = [];
  opened:boolean;
  showFiller = false;
  dataSelectCategory:any = [];
  urlCategory:string;
  vanderaCategory:boolean = true;
  listCategoriasCache = [];

  constructor(
    private _productos: ProductoService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _tools: ToolsService,
    public _formato: FormatosService,
    private _bottomSheet: MatBottomSheet,
    private activate: ActivatedRoute,
    private _user: UsuariosService,
    private _router: Router
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.listProductosHistorial = _.orderBy(store.productoHistorial, ['createdAt'], ['DESC']);
      this.tiendaInfo = store.configuracion || {};
      if( store.buscador ) if( Object.keys(store.buscador).length > 0 ) {  if( store.buscador.search ) { this.seartxt = store.buscador.search; this.buscar(); this.borrarBusqueda(); this.dataSeleccionda = store.buscador.search } }
      if( store.usercabeza ) this.query.where.idPrice = store.usercabeza.id;
      this.userCabeza = store.usercabeza || {};
      this.userId = store.usercabeza || {};
      this.listCategorias = store.categoria || [];
      this.listCategoriasCache = store.categoria || [];
    });
  }

  async ngOnInit() {
    this.id = this.activate.snapshot.paramMap.get('id');
    if( this.id ) {
      this.dataUser = ( await this.getUser() ) || { id: 1 };
      this.urlCategory = 'front/index/'+this.dataUser.usu_telefono;
      this.listBanner.push( { image: "./assets/imagenes/banner5.png", id: 1 } )
      this.listBanner.push( { image: "./assets/imagenes/banner4.png", id: 2 } )
      //this.listBanner.push( { image: this.dataUser.us_banner, id: 2 } )
    }
    else this.dataUser = { id: 1 }
    if( !this.activate.snapshot.paramMap.get('idCategory') ) this.getProductos();
    this.getCategorias();
    this.getProductosRecomendado();
    let interval1 = setInterval(()=> {

      let valorParams = Number( this.activate.snapshot.paramMap.get('idCategory'));
      if( valorParams === 0 ) valorParams = 800;
      if( valorParams !== this.query.where.pro_categoria ){
        this.vanderaCategory = true;
        this.handleProcessCategory( Number( this.activate.snapshot.paramMap.get('idCategory') ) );
      }else this.vanderaCategory = false;
      //console.log( this.nav)
      this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.userId.id ) {
        //console.log("**NO ENTRE",this.userId)
        color = this.userId.usu_color || "#02a0e3";
      }
      //console.log("***144",color, this.dataUser )
      try {
        this.nav.nativeElement.style.backgroundColor = color;
      } catch (error) {

      }
    }, 1000 );
  }

  handleProcessCategory( id:number ){
    if( id === 0 ) id = 800;
    if( ( this.vanderaCategory === true && id ) ) {
      this.SeleccionCategoria( { id: id }); this.vanderaCategory = false;
      let filtro = this.listCategorias.find( item => item.id === id );
      if( filtro ) this.dataSeleccionda = filtro.cat_nombre;
    }
    else this.vanderaCategory = false;
  }

  handleWhatsapp(){
    let url = `https://wa.me/57${ this.userCabeza.usu_telefono }?text=${encodeURIComponent(` Hola servicio al cliente necesito mas informacion gracias`)}`;
    window.open( url, "Mas Informacion", "width=640, height=480");
  }

  getUser(){
    return new Promise( resolve =>{
      this._user.get({ where:{ usu_telefono: this.id }, limit: 1 } ).subscribe( item =>{
        item = item.data[0];
        if( item ) {
          this.GuardarStoreUser( item );
          this.query.where.idPrice = item.id;
        }
        resolve( item );
      },()=> resolve( false ) );
    })
  }

  GuardarStoreUser( data:any ) {
    let accion = new UserCabezaAction( data , 'post');
    this._store.dispatch(accion);
  }

  getCategorias(){
    this._categorias.get( { idUser: this.userCabeza.id, where:{ cat_activo: 0, cat_padre:null }, limit: 10000 } ).subscribe( async (res:any)=>{
      //this.listCategorias = res.data;
      for( let item of res.data ){
        let resSubt = ( await this.getSubcategoria( item.id ) ) || [];
        let dataEnd = {
          ...item,
          title: item.cat_nombre,
          subCategoria: resSubt
        };
        this.listCategorias.push( dataEnd );
      }
      console.log("categorias", this.listCategorias)
      this.listCategorias.unshift({
        id: 0,
        title: "TODOS",
        cat_nombre: "TODOS",
        cat_imagen: "./assets/imagenes/todos.png",
        subCategoria: []
      });
      this.handleProcessCategoryCache( );
      //console.log("***149", this.listCategorias)
    });
  }

  handleProcessCategoryCache( ){
    for( let row of this.listCategorias ){
      let filtro = this.listCategoriasCache.find( item => item.id === row.id );
      let accion;
      if( filtro ) accion = new CategoriaAction( row, 'put' );
      else accion = new CategoriaAction( row, 'post' );

      this._store.dispatch( accion );
    }
  }

  async getSubcategoria( id:any ){
    return new Promise
    ( resolve =>{
      this._categorias.get( { idUser: this.userCabeza.id, where: { cat_padre: id, cat_activo: 0 }, limit: 1000 } ).subscribe(( res:any )=>{
        //console.log("****164", res, id)
        resolve( res.data );
      }, ()=> resolve( false ) );
    });
}

  eventorOver( item:any, drawer:any ){
    //console.log( item )
    item.check = !item.check;
    for( let row of this.listCategorias ) { if( row.id != item.id ) row.check = false; }
    if( !item.subCategoria ) item.subCategoria = [];
    if( item.subCategoria.length === 0 ) {
      this.SeleccionCategoria( item );
      drawer.toggle();
    }else this.dataSelectCategory = item.subCategoria;
  }

  SeleccionCategoria( obj:any ){
    console.log("***184", obj)
    //this.query = { where:{ pro_activo: 0 }, page: 0, limit: 10 };
    for( let row of this.listCategorias ) row.check = false;
    obj.check=true;
    this.query.page = 0;
    this.query.limit = 30;
    this.query.where.pro_activo = 0;
    this.query.where.idPrice = this.query.where.idPrice;
    delete this.query.sort;
    if( obj.id ) this.query.where.pro_categoria = obj.id;
    this.listProductos = [];
    this.loader = true;
    //if( obj.id === 0 || obj.id === 800 ) delete this.query.where.pro_categoria;
    this.getProductos();
    this.dataSeleccionda = obj.cat_nombre;
    if( ( obj.cat_nombre || obj.title ) && obj.id ) this._router.navigate(['/front/index/'+this.userCabeza.usu_telefono+"/"+obj.id ]);
    if( obj.id === 0 ) this._router.navigate(['/front/index/'+this.userCabeza.usu_telefono] );
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

   handlePageNext(){
    this.notscrolly = false;
    this.query.page++;
    this.query.limit = 30;
    this.getProductos();
  }

  getProductos(){
    this.spinner.show();
    this._productos.getStore(this.query).subscribe((res:any)=>{
      this.listProductos = _.unionBy(this.listProductos || [], res.data, 'id');
      //console.log("******",res)
      this.spinner.hide();
      this.loader = false;
      this.notEmptyPost =  true;
      if (res.data.length === 0 ) {
        this.notEmptyPost =  false;
      }
      this.notscrolly = true;
    }, ( error )=> { console.error(error); this.spinner.hide(); this.loader = false;});
  }

  getProductosRecomendado(){
    this._productos.getStore( { where:{ pro_activo: 0, idPrice: this.query.where.idPrice, position: 100 }, sort: "createdAt DESC", page: 0, limit: 6 }).subscribe((res:any)=>{ console.log(res); this.listProductosRecomendar = res.data; }, ( error )=> { console.error(error); });
  }

  viewProducto( obj:any ){
    const dialogRef = this.dialog.open(InfoProductoComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
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
      //console.log(`Dialog result: ${result}`);
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
    this.query = { where:{ pro_activo: 0, user: this.dataUser.id } ,limit: 30, page: 0 };
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
  buscarFiltro( opt:number ){
    delete this.query.sort;
    this.query.page = 0;
    this.query.limit = 30;
    this.query.where.pro_activo = 0;
    this.query.where.idPrice = this.query.where.idPrice;
    if(opt == 1){
      this.dataSeleccionda = "";
      delete this.query.sort
    }
    if(opt == 2){
      this.dataSeleccionda = "Ordenar nombre";
      this.query.sort = 'pro_nombre DESC';
    }
    if(opt == 3){
      this.dataSeleccionda = "Menor a Mayor";
      this.query.sort = 'pro_uni_venta DESC';
    }
    if(opt == 4){
      this.dataSeleccionda = "Mayor a Menor";
      this.query.sort = 'pro_uni_venta ASC';
    }
    if(opt == 5){
      this.dataSeleccionda = "Ordenar Fecha";
      this.query.sort = 'createdAt DESC';
    }
    this.listProductos = [];
    this.loader = true;
    this.getProductos();
  }

  borrarBusqueda(){
    let accion = new BuscadorAction({}, 'drop');
    this._store.dispatch( accion );
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  listCategorias:any = listCategory;
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {
    //console.log("****237", this.listCategorias)
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  SeleccionCategoria( obj:any ){
  }
}
