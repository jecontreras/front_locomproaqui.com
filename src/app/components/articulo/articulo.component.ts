import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { NgImageSliderComponent } from 'ng-image-slider';
import { BuscarAction, CartAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { ViewProductosComponent } from '../view-productos/view-productos.component';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {
  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  sliderWidth: Number = 1204;
  sliderImageWidth: Number = 211;
  sliderImageHeight: Number = 44;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  query: any = {
    where: {
      pro_activo: 0,
      pro_mp_venta: 0
    },
    page: 0,
    limit: 18
  };
  seartxt: string = '';
  ultimoSeartxt:string = '';
  listProductos: any = [];
  loader: boolean = false;
  urlwhat: string
  userId: any;
  mySlideImages = [];
  imageObject: any = [];

  notscrolly: boolean = true;
  notEmptyPost: boolean = true;
  dataUser: any = {};
  idCategoria: any = "";
  bandera: any = 0;
  urlColor:string;
  counts:number = 0;
  disabledBtn:boolean = false;
  dataConfig:any = {};
  rolname:string;
  filtro:any = {};
  listTallas:any = [];
  disabledFiltro:boolean = false;
  coinShop:boolean = false;
  titleButton:string = "Hacer pedido";
  opcionCurrencys: any = {};
  id:string;

  constructor(
    private _productos: ProductoService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    public _tools: ToolsService,
    private activate: ActivatedRoute,
    private _user: UsuariosService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService,
    private _catalago: CatalogoService,
    private _router: Router,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.userId = store.usercabeza;
      this.dataUser = store.user || {};
      this.dataConfig = store.configuracion || {};
      if( this.seartxt != store.buscar && store.buscar ) {
        this.seartxt = store.buscar;
      }
      if( this.dataUser.id ){
        try {
          if (this.dataUser.usu_perfil) {
            this.rolname = this.dataUser.usu_perfil.prf_descripcion;
          }
        } catch (error) {
          this.rolname = "visitante";
        }
      }
    });

  }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    let urlPath = window.location;
    const pr = urlPath.pathname.split("/");
    //if( pr[1] && pr[2] && pr[3] ) this.getId( pr[3] )
    console.log("****", urlPath, pr );
    this.id = pr[2];
    setInterval(()=> {
      try {
        let color:string = ( this.dataUser.usu_color || "#02a0e3" );
        if( this.userId.id ) color = this.userId.usu_color || "#02a0e3";
        this.urlColor = color;
      } catch (error) {}
    }, 100 );

    this.cargarProductos();
    //this.getCategorias();
  }

  getId( id:string ){
    this._productos.get( { where: { id: id } } ).subscribe(res=>{
      res = res.data[0];
      if( res ) this.agregar( res );
    })
  }

  clearSearch(){
    let accion:any = new BuscarAction( "", "drop" );
    this._store.dispatch( accion );
    this.seartxt = "";
    this.ultimoSeartxt = "";
  }

  async descargarFoto( item:any ){
    if( this.disabledBtn ) return false;
    this.disabledBtn = true;
    item.base64 = await this._catalago.FormatoBase64( item.foto );
    await this._tools.descargarFoto( item.base64 );
    try {
      let lista:any = item.listaGaleria || [];
      lista.push(..._.map( item.listColor, ( row:any )=> { return { foto: row.foto, id: row.id }; } ) );
      //console.log( lista );
      if( lista ){
        for( let row of lista ){
          this._tools.ProcessTime( { title: "Descargando..." } );
          row.base64 = await this._catalago.FormatoBase64( row.foto );
          await this._tools.descargarFoto( row.base64 );
        }
      }
      this.disabledBtn = false;
    } catch (error) {
      //console.log(error)
      this.disabledBtn = false;
    }
  }

  // ngOnChanges()  {
  //   console.log("**change")
  // }

  // ngDocheck(){
  //   console.log("***docheck")
  // }

  // ngAfterContentInit(){
  //   console.log("**ngafter")
  // }

  // ngAfterContentChecked(){
  //   console.log("***ngAftercontent")
  // }

  // ngAfterViewInit(){
  //   console.log("*ngAfterview")
  // }

  ngAfterViewChecked() {
    // console.log("***afterviewCheckd")
    this.idCategoria = this.activate.snapshot.paramMap.get('categoria');
    //console.log( this.idCategoria , this.bandera );
    if (this.bandera !== this.idCategoria && this.idCategoria !== 'compra') {
      this.bandera = this.idCategoria
      this.listProductos = [];
      this.nextConsulta();
    }
  }

  pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarProductos();
  }


  nextConsulta() {
    if (this.idCategoria) this.query.where.pro_categoria = this.idCategoria;
    this.getCategorias();
    setTimeout(()=> this.cargarProductos(), 1000 )
  }

  getUser() {
    this._user.get({ where: {
      usu_usuario: this.userId
    } }).subscribe((res: any) => {
      this.userId = res.data[0];
      if( this.userId ) this.GuardarStoreUser()
    }, (error) => { console.error(error); this.userId = ''; });
  }
  GuardarStoreUser() {
    let accion = new UserCabezaAction(this.userId, 'post');
    this._store.dispatch(accion);
  }
  getCategorias() {
    this._categorias.get({ where: { cat_activo: 0, cat_padre: null }, limit: 1000 }).subscribe( async (res: any) => {
      this.imageObject = [];
      for (let row of res.data) {
        let datos: any = {
          id: row.id,
          title: row.cat_nombre,
          subCategoria: await this.getSubcategoria( row.id )
        };
        if (row.id == this.idCategoria) datos.check = true;
        this.imageObject.push(datos);
      }
      this.imageObject.unshift({
        id: 0,
        title: "TODOS",
        subCategoria: []
      });
      console.log( this.imageObject );
    });
  }

  eventorOver( item:any ){
    console.log( item )
    item.check = !item.check;
    for( let row of this.imageObject ) { if( row.id != item.id ) row.check = false; }
    this.query.where.pro_categoria = item.id;
    this.listProductos = [];
    this.cargarProductos();
    //this._router.navigate( [ "/articulo/"+this.id , item['id'] ] );
  }

  eventoDes( item:any ){
    for( let row of this.imageObject ) row.check = false;
  }

  async getSubcategoria( id:any ){
      return new Promise
      ( resolve =>{
        this._categorias.get( { where: { cat_padre: id, cat_activo: 0 }, limit: 1000 } ).subscribe(( res:any )=>{
          resolve( res.data );
        }, ()=> resolve( false ) );
      });
  }
  cargarProductos(): void {
    this.spinner.show();
    if( this.seartxt ) this.ultimoSeartxt = this.seartxt;
    this.loader = true;
    //console.log( this.ultimoSeartxt );
    if( this.dataUser.id ) this.query.where.user = this.dataUser.id;
    this.query.where.pro_usu_creacion = 1;
    if( this.dataUser.id ) this.query.where.idPrice = this.dataUser.id;
    this._productos.get(this.query).subscribe((res: any) => {
      console.log("res", res);
      this.loader = false;
      this.counts = res.count;
      this.spinner.hide();
      this.listProductos = _.unionBy( this.listProductos || [], res.data, 'id' );
      try {
        this.listTallas = this.listProductos[0].listaTallas;
      } catch (error) { }
      /*for( let row of this.listProductos ){
        if( !row.listColor22 ) row.listColor = [];
        let lleno = []
        for( let key of row.listColor ) {
          console.log(":::", key)
          lleno.push( ... key.tallaSelect || [] );
        }
        row.listColor22 = _.unionBy( row.listColor || [], lleno, 'tal_descripcion');
      }*/

      if (res.data.length === 0) {
        this.notEmptyPost = false;
      }
      this.notscrolly = true;
      this.clearSearch();
    },( error:any )=>{
      this.loader = false;
      this.spinner.hide();
    });
  }
  buscar() {
    //console.log(this.seartxt);
    this.loader = true;
    try { this.seartxt = this.seartxt.trim(); } catch (error) { this.seartxt = ""; }
    this.listProductos = [];
    this.notscrolly = true;
    this.notEmptyPost = true;
    if (this.seartxt === '') {
      this.query = { where: { pro_activo: 0 }, limit: 18, page: 0 };
      this.cargarProductos();
    } else {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.seartxt || ''
          }
        },
        /*{
          pro_descripcion: {
            contains: this.seartxt || ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.seartxt || ''
          }
        },*/
        {
          pro_codigo: {
            contains: this.seartxt || ''
          }
        }
      ];
      this.cargarProductos();
    }
  }
  agregar(obj) {
    obj.coinShop = this.coinShop;
    obj.disabledBtn = true;
    const dialogRef = this.dialog.open(ViewProductosComponent, {
      width: '100%',
      maxHeight: "700%",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      //this._router.navigate(['/pedidos']);
    });
  }
  masInfo(obj: any) {
    let cerialNumero: any = '';
    let numeroSplit: any;
    let cabeza: any = this.dataUser.cabeza;
    if (!obj.tallasSelect) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    if (cabeza) {
      numeroSplit = _.split(cabeza.usu_telefono, "+57", 2);
      if (numeroSplit[1]) cabeza.usu_telefono = numeroSplit[1];
      if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || this._tools.dataConfig.clInformacion );
      else cerialNumero = "57"+ this._tools.dataConfig.clInformacion;
    } else cerialNumero = "57"+ this._tools.dataConfig.clInformacion;
    if ( this.userId.id ) this.urlwhat = `https://wa.me/${this.userId.usu_indicativo || 57}${( this.userId.usu_telefono ) || this._tools.dataConfig.clInformacion }?text=Hola ${ this.userId.usu_usuario }, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} codigo: ${obj.pro_codigo} talla: ${obj.tallasSelect} foto ==> ${obj.foto}`;
    else {
      this.urlwhat = `https://wa.me/${cerialNumero}?text=Hola, estoy interesad@ en mas informacion codigo: ${obj.pro_nombre} talla: ${obj.tallasSelect} foto ==> ${obj.foto}`;
    }
    console.log("****", this.urlwhat);
    window.open(this.urlwhat);
  }

  maxCantidad(obj: any) {
    if (!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.cantidadAdquirir++;
    obj.pro_uni_ventaEdit = (obj.cantidadAdquirir * obj.pro_uni_venta);
  }

  manualCantidad(obj: any) {
    if (!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.pro_uni_ventaEdit = (obj.cantidadAdquirir * obj.pro_uni_venta);
  }

  menosCantidad(obj) {
    //console.log( obj )
    if (!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.cantidadAdquirir = obj.cantidadAdquirir - 1;
    if (obj.cantidadAdquirir <= -1) obj.cantidadAdquirir = 0;
    obj.pro_uni_ventaEdit = (obj.cantidadAdquirir * obj.pro_uni_venta);
  }

  AgregarCart(item: any) {
    console.log(item);
    this.agregar( item );
    return false;
    if (!item.tallasSelect) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    let data: any = {
      articulo: item.id,
      codigo: item.pro_codigo,
      titulo: item.pro_nombre,
      tallaSelect: item.tallasSelect,
      foto: item.foto,
      cantidad: item.cantidadAdquirir || 1,
      costo: item.pro_uni_venta,
      costoTotal: (item.pro_uni_venta * (item.cantidadAdquirir || 1)),
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Agregado al Carro");
  }

  imageOnClick(index: any, obj: any, opt:string ) {
    //con
    for ( let row of this.imageObject ) { row.check = false; for( let key of row.subCategoria ) key.check = false; }
    obj.check = true;
    this.query = { where: { pro_activo: 0 }, page: 0, limit: 18 };
    this.seartxt = "";
    if ( obj.id > 0 ) this.query = { where: { pro_activo: 0, pro_sub_categoria: obj.id }, page: 0, limit: 10 };
    this.listProductos = [];
    this.notscrolly = true;
    this.notEmptyPost = true;
    console.log("****412", opt, index)
    if( opt == 'no' ) this.cargarProductos();
  }

  arrowOnClick(event) {
    //console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
    //console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      this.query.page++;
      this.cargarProductos();
    }
  }

  openShare(obj: any) {
    if (navigator['share']) {
      navigator['share']({
        title: obj.pro_nombre,
        text: obj.foto + `link del producto $${obj.pro_uni_venta.toLocaleString(1)} COP ---> https://www.locomproaqui.com/productos/${obj.id} }`,
        url: obj.foto,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log("no se pudo compartir porque no se soporta");
      let url = `https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=https://www.locomproaqui.com/productos/15?u=https://www.locomproaqui.com/productos/${obj.id}`;
      window.open(url);
    }
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  buscarExpert(){
    this.query = {
      where: {
        pro_activo: 0,
        pro_mp_venta: 0,
      },
      filtro: this.filtro,
      page: 0,
      limit: 18
    };
    this.loader = true;
    this.listProductos = [];
    this.notscrolly = true;
    this.cargarProductos();
  }

  buscarLimpiar(){
    this.query = {
      where: {
        pro_activo: 0,
        pro_mp_venta: 0
      },
      page: 0,
      limit: 18
    };
    this.loader = true;
    this.listProductos = [];
    this.notscrolly = true;
    this.cargarProductos();
  }

  handleEdit( item:any ){
    if( !this.dataUser.id ) return false;
    this.disabledBtn = true;
    this._productos.createPrice({
      article: item.id,
      user: this.dataUser.id,
      price: item.pro_uni_venta
    }).subscribe(res=>{
      this._tools.presentToast("Actualizado el precio...!");
      this.disabledBtn = false;
    },()=> this.disabledBtn = false );
  }

}
