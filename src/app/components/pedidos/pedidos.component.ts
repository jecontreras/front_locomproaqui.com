import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { MatDialog } from '@angular/material';
import { ViewProductosComponent } from '../view-productos/view-productos.component';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { BuscarAction, CartAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
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
      pro_activo: 0
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

  constructor(
    private _productos: ProductoService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _tools: ToolsService,
    private activate: ActivatedRoute,
    private _user: UsuariosService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService,
    private _catalago: CatalogoService,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.userId = store.usercabeza;
      this.dataUser = store.user || {};
      if( this.seartxt != store.buscar && store.buscar ) { 
        this.seartxt = store.buscar;
      }
    });

  }

  ngOnInit() {
    setInterval(()=> {
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.userId.id ) color = this.userId.usu_color || "#02a0e3";
      this.urlColor = color;
    }, 100 );

    if ( ( this.activate.snapshot.paramMap.get('id') ) ) { this.userId = ( this.activate.snapshot.paramMap.get('id') ); this.getUser(); }
    setInterval( ()=>{
      //console.log( this.seartxt, this.ultimoSeartxt );
      if( this.seartxt !== this.ultimoSeartxt ) this.buscar(); 
    }, 1000 );
  }

  clearSearch(){
    let accion:any = new BuscarAction( "", "drop" );
    this._store.dispatch( accion );
    this.seartxt = "";
    this.ultimoSeartxt = "";
  }

  async descargarFoto( item:any ){
    item.base64 = await this._catalago.FormatoBase64( item.foto );
    await this._tools.descargarFoto( item.base64 );
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
    // console.log( this.idCategoria , this.bandera );
    if (this.bandera !== this.idCategoria) {
      this.bandera = this.idCategoria
      this.listProductos = [];
      this.nextConsulta();
    }
  }

  nextConsulta() {
    if (this.idCategoria) this.query.where.pro_categoria = this.idCategoria;
    this.getCategorias();
    this.cargarProductos();
  }

  getUser() {
    this._user.get({ where: { id: this.userId } }).subscribe((res: any) => { this.userId = res.data[0]; this.GuardarStoreUser() }, (error) => { console.error(error); this.userId = ''; });
  }
  GuardarStoreUser() {
    let accion = new UserCabezaAction(this.userId, 'post');
    this._store.dispatch(accion);
  }
  getCategorias() {
    this._categorias.get({ where: { cat_activo: 0 }, limit: 100 }).subscribe((res: any) => {
      this.imageObject = [];
      for (let row of res.data) {
        let datos: any = {
          image: row.cat_imagen || './assets/categoria.jpeg',
          thumbImage: row.cat_imagen,
          alt: '',
          id: row.id,
          title: row.cat_nombre
        };
        if (row.id == this.idCategoria) datos.check = true;
        this.imageObject.push(datos);
      }
      this.imageObject.unshift({
        image: './assets/categoria.jpeg',
        thumbImage: './assets/categoria.jpeg',
        alt: '',
        check: !this.idCategoria ? true : false,
        id: 0,
        title: "Todos"
      });
    });
  }
  cargarProductos(): void {
    this.spinner.show();
    if( this.seartxt ) this.ultimoSeartxt = this.seartxt;
    //console.log( this.ultimoSeartxt );
    this._productos.get(this.query).subscribe((res: any) => {
      console.log("res", res);
      this.loader = false;
      this.spinner.hide();
      this.listProductos = _.unionBy(this.listProductos || [], res.data, 'id');

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
        {
          pro_descripcion: {
            contains: this.seartxt || ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.seartxt || ''
          }
        },
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
    const dialogRef = this.dialog.open(ViewProductosComponent, {
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
      if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || '3148487506');
      else cerialNumero = "573148487506";
    } else cerialNumero = "573148487506";
    if (this.userId.id) this.urlwhat = `https://wa.me/${this.userId.usu_indicativo || 57}${((_.split(this.userId.usu_telefono, "+57", 2))[1]) || '3148487506'}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} codigo: ${obj.pro_codigo} talla: ${obj.tallasSelect} foto ==> ${obj.foto}`;
    else {
      this.urlwhat = `https://wa.me/${cerialNumero}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo: ${obj.pro_codigo} talla: ${obj.tallasSelect} foto ==> ${obj.foto}`;
    }
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
    if (!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.cantidadAdquirir = obj.cantidadAdquirir - 1;
    if (obj.cantidadAdquirir <= -1) obj.cantidadAdquirir = 0;
    obj.pro_uni_ventaEdit = (obj.cantidadAdquirir * obj.pro_uni_venta);
  }

  AgregarCart(item: any) {
    console.log(item);
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

  imageOnClick(index: any, obj: any) {
    //con
    for (let row of this.imageObject) row.check = false;
    obj.check = true;
    this.query = { where: { pro_activo: 0 }, page: 0, limit: 18 };
    this.seartxt = "";
    if (this.imageObject[index].id > 0) this.query = { where: { pro_activo: 0, pro_categoria: this.imageObject[index].id }, page: 0, limit: 10 };
    this.listProductos = [];
    this.notscrolly = true;
    this.notEmptyPost = true;
    this.cargarProductos();
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

}
