import { Component, OnDestroy, ChangeDetectorRef, OnInit, VERSION, ViewChild, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../components/login/login.component';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { BuscarAction, CartAction, UserAction, UserCabezaAction, UserprAction } from 'src/app/redux/app.actions';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';
import { FormventasComponent } from 'src/app/dashboard-config/form/formventas/formventas.component';
import { FormtestimoniosComponent } from 'src/app/dashboard-config/form/formtestimonios/formtestimonios.component';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { DialogconfirmarPedidoComponent } from '../dialogconfirmar-pedido/dialogconfirmar-pedido.component';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

const URLFRON = location.origin;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showFiller = false;

  @ViewChild('toolbar',{static: false} ) private nav: any
  @ViewChild('sidenav') sidenav;

  public mobileQuery: any;
  breakpoint: number;
  private _mobileQueryListener: () => void;
  menus:any = [];
  menus2:any = [];
  dataUser:any = {};
  rolUser:any = {};
  rolUser1:string;
  data:any = {
    total: 0
  };
  listCart: any = [];

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  events: string[] = [];
  urlwhat:string;
  userId:any;
  opened:boolean;
  dataInfo:any = {};
  isHandset$:any = false;
  hasBackdrop$:any = true;
  urlRegistro:string = `${ URLFRON }/registro/`;
  notificando:number = 0;
  opcionoView:string = 'carro';
  listNotificaciones:any =[];
  listAlert:any = [];
  seartxt:string = "";
  disabledSearch:boolean = true;
  urlLogo:string = "./assets/logo.png";
  ultimoSer:string;
  userPr:any = {};
  porcentajeUser: number = 0;
  namePorcentaje: string;
  porcentajeMostrar: number = 0;
  lentcoun:number = 0;
  booleanoOpen:boolean = false;
  eventos:any = {
    cobros: 0,
    ventas: 0
  };
  urlTienda: string = `${ URLFRON }/front/index/`;
  urlDistribuidor:string =`${ URLFRON }/pedidos/0`;
  activando:boolean = false;

  querysSale:any = {
    where:{
    },
    limit: 10,
    skip: 0
  };
  reacudo:number;
  routName:string = "";
  validatorVist:boolean;
  usuPerfil: number = 0;
  billetera = { enTransito : 0, pendiente : 0, porCobrar : 0  }
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher, private router: Router,
    public dialog: MatDialog,
    private _store: Store<CART>,
    private _user: UsuariosService,
    public _tools: ToolsService,
    private _notificaciones: NotificacionesService,
    private _venta: VentasService,
    private _categorias: CategoriasService,
    private _retiros: CobrosService,
    private _productos: ProductoService,

  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCart = store.cart || [];
      try { this.validatorVist = this.listCart[0].coinShop === true ? false : true; } catch (error) { }
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.userPr = store.userpr || {};
      this.querysSale.where.creacion = this.dataUser.id;
      if( store.buscar ) {
        this.seartxt = store.buscar;
      }
      if( this.listCart.length > this.lentcoun && this.booleanoOpen ) {
        this.opcionoView = 'carro';
        this.opened = !this.opened;
      }else {
        this.lentcoun = this.listCart.length;
        this.booleanoOpen = true;
      }
      //console.log( window.innerWidth )
      this.disabledSearch = window.innerWidth <= 600 ? true : false;

      if( this.dataUser.id ){
        console.log("datauser", this.dataUser)
        this.rolUser = this.dataUser.usu_perfil.prf_descripcion;
        this.activando = false;
        if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.activando = true;
        try {
          if (this.dataUser.categoriaPerfil) {
            this.porcentajeUser = this.dataUser.categoriaPerfil.precioPorcentaje;
            this.namePorcentaje = this.dataUser.categoriaPerfil.categoria;
          }
        } catch (error) {
          this.porcentajeUser = 0;
          this.namePorcentaje = "dropshipping básico";
        }
        if( this.porcentajeUser > this.dataUser.porcentaje ) this.porcentajeMostrar = this.porcentajeUser;
        else this.porcentajeMostrar = this.dataUser.porcentaje;
        this.usuPerfil = this.dataUser.usu_perfil.id
        console.log("usuperfil", this.usuPerfil)
      }
      this.submitChat();
    });
    //this.getVentas();
    this.mobileQuery = media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;

  }

  ngOnInit() {
    this.listMenus();
    this.loadCoin();
    this.routName = window.location.pathname;
    this.urlTienda += this.dataUser.usu_telefono;
    //this.urlDistribuidor +=this.dataUser.usu_telefono;
    this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
    /*if( this.breakpoint == 1 ) {
      this.isHandset$ = false;
      this.hasBackdrop$ = true;
    }*/
    //console.log( this.isHandset$, this.breakpoint, window.innerWidth )

    setInterval(()=> {
      this.routName = ( window.location.pathname.split("/"))[1];
      try {
        //console.log( this.nav)
        let color:string = ( this.dataUser.usu_color || "#02a0e3" );
        if( this.userId.id ) {
          //console.log("**NO ENTRE",this.userId)
          color = this.userId.usu_color || "#02a0e3";
          this.urlLogo = this.userId.usu_imagen || './assets/logo.png';
        }
        if( this.dataUser.id ) this.urlLogo = this.dataUser.usu_imagen || './assets/logo.png';
        //console.log("***144",color, this.dataUser )
        this.nav.nativeElement.style.backgroundColor = color;
      } catch (error) {}
    }, 1000 );

    try {
      if( this.dataUser.estado === 0 && this.dataUser.usu_perfil.prf_descripcion === 'proveedor' ){
        //console.log("updatedAT", this.dataUser.updatedAt)
        const fecha = new Date();
        const hoy = Date.now()
        let date1 = new Date(this.dataUser.createdAt);
        let date2 = new Date(hoy);
        let Difference_In_Time =
            date2.getTime() - date1.getTime();

        let Difference_In_Days =
            Math.round
                (Difference_In_Time / (1000 * 3600 * 24));
        if(Difference_In_Days < 15){
          this.listAlert.unshift(
            {
              id: this._tools.codigo(),
              titulo: "Importante",
              descripcion: "¡Felicidades, Tu Cuenta está activa! 👌😍",
              tipoDe: 2
            }
          );
        }
      }
      if( this.dataUser.estado === 1 && this.dataUser.usu_perfil.prf_descripcion === 'proveedor' ){
        if( this.dataUser.pdfCComercio && this.dataUser.pdfCc && this.dataUser.pdfRut && this.dataUser.usu_ciudad && this.dataUser.usu_email && this.dataUser.usu_telefono ){
          this.listAlert.unshift(
            {
              id: this._tools.codigo(),
              titulo: "Importante",
              descripcion: "¡Tu cuenta está inactiva! Espere las próximas horas que nuestro grupo de logística activen tu usuario!",
              tipoDe: 2
            }
          );
        }else{
          this.listAlert.unshift(
            {
              id: this._tools.codigo(),
              titulo: "Importante",
              descripcion: "¡Tu cuenta está inactiva! Por Favor llenar toda la información para poder activar tu cuenta Ingresá al perfil y completa tus datos!",
              tipoDe: 2
            }
          );
        }
      }
    } catch (error) { }

    this.onResize(null);
    if(Object.keys(this.dataUser).length > 0 ) {
      this.rolUser = this.dataUser.usu_perfil.prf_descripcion;
      this.rolUser1 = this.dataUser.usu_perfil.prf_descripcion;
      this.urlRegistro+=this.dataUser.id;
      this.getInfoUser();
    }
    else { this.rolUser = 'visitante'; this.rolUser1 = "visitante"; }
    try {
      if( Object.keys( this.userPr ).length > 0 ) this.rolUser1 = this.userPr.usu_perfil.prf_descripcion;
    } catch (error) {
      //console.log(error)
    }
    //console.log("***149", this.rolUser)
    if( this.dataUser.id )this.getCarrito();
    if( this.dataUser.id ) this.getAlert();
    this.getEventos();

    if( this.dataUser.id ) this.billeteraCalcular()
  }

  billeteraCalcular(){
    let query = { usu_id : 0, usu_perfil : 0}
      let totalCompletas =0
      let totalDespachado = 0
      let totalPdtePagoTrans = 0
      query.usu_id = this.userId.id
      query.usu_perfil = this.dataUser.usu_perfil.id
      console.log(" billeteraCalcular() query", query)
      this._productos.getVentas( query ).subscribe(res=>{
      //console.log("getSales res", res)
      for( let row of res.data ){
        if(query.usu_perfil == 5){ //proveedor
          if(row.ven_estado == 1 && row.cob_id_proveedor == 0){
            if(row.pagaPlataforma == 1){
              totalCompletas += row.ven_totaldistribuidor
            }else{
              totalPdtePagoTrans += row.ven_totaldistribuidor
            }
          }
          if(row.ven_estado == 3) totalDespachado += row.ven_totaldistribuidor
        }
        if(query.usu_perfil == 1 ){ //vendedor
          if(row.ven_estado == 1 && row.cob_id_vendedor == 0){
            if(row.pagaPlataforma == 1){
              totalCompletas += row.ven_ganancias
            }else
              totalPdtePagoTrans += row.ven_ganancias
          }
          if(row.ven_estado == 3) totalDespachado += row.ven_ganacias
        }
      };
      this.billetera.porCobrar = totalCompletas; //Dinero para solicitar desembolso
      this.billetera.pendiente = totalPdtePagoTrans; //pendiente pago transportadora
      this.billetera.enTransito = totalDespachado; // pedidos en estado 3
      console.log("billetera", this.billetera)
    });
  }

  loadCoin() {
    this._productos.getVentaComplete( this.querysSale ).subscribe(res=>{
      //console.log("***191",res)
      //console.log("_productos.getVentaComplete",res)
      this.reacudo = res.total;
    });
  }

  getEventos(){
    this.getRetirosCount();
    this.getVentasCount();
    this.getVentasPosiblesCount();

  }

  getRetirosCount(){
    this._retiros.get( { where: {
      cob_estado: 0
    } } ).subscribe(( res:any )=>{
      this.eventos.cobros =  res.count;
    });
  }

  getVentasCount(){
    let querys:any = {
      where: {
        ven_estado: 0
      }
    };
    if( this.activando == false ) querys.where.usu_clave_int = this.dataUser.id;
    this._venta.get( querys ).subscribe(( res:any )=>{
      this.eventos.ventas = res.count || 0;
    });
  }

  getVentasPosiblesCount(){
    let querys:any = {
      where: {
        ven_estado: 0
      }
    };
    if( this.activando == false ) querys.where.usu_clave_int = this.dataUser.id;
    this._venta.getPossibleSales( querys ).subscribe(( res:any )=>{
      this.eventos.possibleBuy = res.count || 0;
    });
  }

  activarSearch(){
    this.disabledSearch = !this.disabledSearch;
  }

  buscar(){
    if( this.seartxt == this.ultimoSer ) return false;
    let accion:any = new BuscarAction( this.seartxt, 'post');
    this._store.dispatch( accion );
    this.ultimoSer = this.seartxt;
  }

  getVentas(){
    //console.log("***")
    let data:any = { where:{ view:0, admin: 1 },limit: 100 };
    if( this.rolUser === 'administrador' ) data.where.admin = 1;
    else if( this.rolUser == 'subAdministrador') data.where.admin = 2;
    else data.where.user = this.dataUser.id;

    //if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') data.where.user=this.dataUser.id,
    this._notificaciones.get( data ).subscribe((res:any)=>{
      //console.log(res);
      if(res.data.length > this.notificando) this.audioNotificando('./assets/sonidos/notificando.mp3');
      this.notificando = res.data.length;
      this.listNotificaciones = res.data;
    },(error)=>{});
  }

  audioNotificando(obj:string){
    let sonido = new Audio();
    sonido.src = './assets/sonidos/notificando.mp3';
    sonido.load();
    sonido.play();
  }

  getCarrito(){
    setInterval(()=>{
      this.getVentas();
    }, 50000);
  }

  pedidosSubmit(){
    if( !this.dataUser.id ) {
      this.data.listCart = this.listCart || [];
      const dialogRef = this.dialog.open(DialogconfirmarPedidoComponent,{
        data: { datos: this.data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result:`, result );
        if( !result.nombre ) return false;
        this.urlwhat+= ` ${encodeURIComponent(`
        Para confirmar adquiere este producto
        Mis Datos
        Nombre de cliente: ${ result.nombre }
        *celular:*${ result.telefono }
        Ciudad: ${ result.ciudad }
        Barrio: ${ result.barrio }
        Dirección: ${ result.direccion }
        cedula: ${ result.cedula }

        TOTAL FACTURA ${( result.total )}
        🤝Gracias por su atención y quedo pendiente para recibir por este medio la imagen de la guía de despacho`)}`;
        window.open( this.urlwhat );
        let accion = new CartAction( {}, 'drop');
        this._store.dispatch( accion );
        return true;
      });
    }
    else{
      const dialogRef = this.dialog.open(FormventasComponent,{
        data: { datos: {} }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  clickNotificando( obj:any ){
    //console.log(obj);
    this.estadoNotificaciones(obj);
    if(obj.venta){
      this._venta.get({ where:{ id: obj.venta } }).subscribe((res:any)=>{
        res = res.data[0];
        if(!res) return this._tools.presentToast("No se encontro la venta!");
        const dialogRef = this.dialog.open(FormventasComponent,{
          data: {datos: res }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      });
    }
  }

  estadoNotificaciones(obj:any){
    let data:any ={
      id: obj.id,
      view: 1
    };
    this._notificaciones.update(data).subscribe((res:any)=>{});
  }

  deleteCart(idx:any, item:any){
    this.listCart.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
  }

  submitChat(){
    let texto:string = "";
    this.data.total = 0;
    this.data.totalGanancias = 0;
    //console.log( this.porcentajeUser,this.namePorcentaje )
    //console.log( this.listCart)
    for(let row of this.listCart){
      //texto+= ` productos: ${ row.titulo } codigo: ${ row.codigo } talla: ${ row.tallaSelect } cantidad: ${ row.cantidad } precio: ${ row.costo } precio Total: ${ row.costoTotal } foto: ${ row.foto } color ${ row.color || 'default'}`;
      texto+= `${ encodeURIComponent(`
        Foto: ${ row.foto }
        Talla: ${ row.tallaSelect }
        Color ${ row.color || 'default' }
        Ref:${ row.codigo }
        Valor: ${ this._tools.monedaChange( 3, 2, row.costo ) }
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        `)
      }`;
      this.data.total+= row.loVendio || 0;
      if ( this.namePorcentaje == "dropshipping básico" ) this.data.totalGanancias+= ( row.costoTotal * ( this.dataUser.porcentaje || 10 ) / 100 );
      else this.data.totalGanancias+= ( row.loVendio - ( row.costoTotal ) ) || 0;
    }

    let cerialNumero:any = '';
    let numeroSplit:any;
    let cabeza:any = this.dataUser.cabeza;
    if( cabeza ) {
      //console.log(cabeza)
      numeroSplit = _.split( cabeza.usu_telefono, "+57", 2);
      if( numeroSplit[1] ) cabeza.usu_telefono = numeroSplit[1];
      if( cabeza.usu_perfil == 3 ) cerialNumero = ( cabeza.usu_indicativo || '57' ) + ( cabeza.usu_telefono || '3506700802' );
      else cerialNumero = `${ this.userId.usu_indicativo || 57 }${ this.userId.usu_telefono || '3506700802'}`;
    }else cerialNumero = "573506700802";
    if( this.userId.id ) this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ ( this.userId.usu_telefono ) || 3506700802 }?text=Hola estoy interesad@ en los siguientes productos ${texto}`
    else this.urlwhat = `https://wa.me/${ cerialNumero  }?text=Hola estoy interesad@ en los siguientes productos ${texto}`
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getInfoUser(){
    this._user.getInfo({where:{id:this.dataUser.id}}).subscribe((res:any)=>this.dataInfo = res.data);
  }

  onResize(event:any) {
    // console.log("hey", event);
    if (event) {
      this.breakpoint = (event.target.innerWidth <= 700) ? 1 : 6;
    }
    // console.log(this.breakpoint);
    if (this.breakpoint === 1) {
      this.mobileQuery.ds = true;
    } else {
      // console.log(this.mobileQuery);
      this.mobileQuery.ds = false;
    }
  }

  EventMenus(obj:any){
    console.log(obj);
    if( obj.url == 'login()' ) this.login();
    if( obj.url == 'registrar()' ) this.registrar();
    if( obj.url == 'salir()' ) this.salir();
    if( obj.url == 'shareTienda()' ) this.shareTienda();
    if( obj.url == 'ayuda()' ) window.open("https://www.youtube.com/channel/UCVrLNcx0H2COUCBfSWcYI8g/featured");
    if( obj.url == 'handleRechargeNalance()' ) this.handleRechargeNalance();
  }

  btnCarrito(){

  }

  async listMenus(){
    let submenus = await this.getCategorias();
    //console.log( submenus );
    this.menus = [
      {
        icons: 'home',
        nombre: 'Inicio',
        disable: true,
        url: '/articulo',
        submenus:[]
      },
      {
        icons: 'menu_book',
        nombre: 'Productos',
        disable: ( this.rolUser != 'proveedor' ),
        disabled: true,
        url: '/pedidos',
        submenus: submenus
      },
      {
        icons: 'menu_book',
        nombre: 'Hacer Compra',
        disable: ( this.dataUser.id ) && ( this.rolUser != 'proveedor' ),
        url: 'handleShop()',
        submenus:[]
      },
      {
        icons: 'menu_book',
        nombre: 'Realizar Venta',
        disable: ( this.dataUser.id ) && ( this.rolUser != 'proveedor' ),
        url: '/realizarventa',
        submenus:[]
      },
      {
        icons: 'menu_book',
        nombre: 'Mis Producto En la Tienda',
        disable: this.rolUser == 'administrador' || this.rolUser == 'proveedor',
        url: '/storeProductActivated/'+this.dataUser.id,
        submenus: []
      },
      {
        icons: 'local_grocery_store',
        nombre: 'Autorizar Despacho',
        disable: ( this.rolUser !== 'visitante' ) && ( this.rolUser != 'proveedor' ),
        url: '/config/ventasPosibles',
        submenus:[]
      },
      {
        icons: 'local_grocery_store',
        nombre: 'Historial de Ventas',
        disable: ( this.rolUser !== 'visitante' ) && ( this.rolUser != 'proveedor' ),
        url: '/config/ventas',
        submenus:[]
      },
      {
        icons: 'shop',
        nombre: 'Mis Cobros!',
        disable: ( this.rolUser !== 'visitante' ) && ( this.rolUser != 'proveedor' ) && ( this.rolUser != 'vendedor' ),
        url: '/config/cobros',
        submenus:[]
      },
      {
        icons: 'shop',
        nombre: 'Mi Biletera',
        disable: ( this.rolUser == 'vendedor' ),
        url: '/config/bank/index',
        submenus:[]
      },
      /*{
        icons: 'announcement',
        nombre: 'Testimonios',
        disable: true,
        url: '/testimonio',
        submenus:[]
      },*/
      /*{
        icons: 'shop',
        nombre: 'Mis Bancos',
        url: '/config/bancos',
        submenus:[]
      },*/
      {
        icons: 'local_grocery_store',
        nombre: 'Ventas Proveedor',
        disable: this.rolUser == 'administrador',
        url: '/config/ventasProveedor',
        submenus:[]
      },
      {
        icons: 'local_grocery_store',
        nombre: 'Ventas de Subvendedor',
        disable: this.rolUser == 'administrador',
        url: '/config/ventasLider',
        submenus:[]
      },
      {
        icons: 'people_alt',
        nombre: 'Mis Referidos',
        disable: this.rolUser == 'administrador' || this.rolUser == 'subAdministrador' || this.rolUser == 'lider' || this.rolUser == 'vendedor',
        url: '/config/referidos',
        submenus:[]
      },
      {
        icons: 'people_alt',
        nombre: 'Control Inventario',
        disable: this.rolUser == 'administrador' || this.rolUser == 'proveedor',
        url: '/config/controlInventario',
        submenus:[]
      },
      {
        icons: 'people_alt',
        nombre: 'Activar Transportadoras',
        disable: this.rolUser == 'administrador' || this.rolUser == 'proveedor',
        url: '/config/listaPlatform',
        submenus:[]
      },
      {
        icons: 'people_alt',
        nombre: 'Explorar Bodegas',
        disable: this.rolUser == 'administrador' || this.rolUser == 'vendedor',
        url: '/config/controlInventario',
        submenus:[
          /*{
            icons: 'settings',
            nombre: 'Proveedores Verficados',
            url: '/config/store/index',
          },*/
          {
            icons: 'settings',
            nombre: 'Bodegas',
            url: '/config/store/stores',
          },
          {
            icons: 'settings',
            nombre: 'Productos',
            url: '/config/store/product',
          },
          {
            icons: 'settings',
            nombre: 'Mis Productos Agregados',
            url: '/config/store/myproducts',
          },
        ]
      },
      {
        icons: 'people_alt',
        nombre: 'Modulo Contable',
        disable: this.rolUser == 'administrador' || this.rolUser == 'proveedor',
        url: '/config/controlInventario',
        submenus:[
          {
            icons: 'settings',
            nombre: 'Mi Billetera',
            url: '/config/bank/index',
          },
          {
            icons: 'settings',
            nombre: 'Lista de Pagos',
            url: '/config/bank/listPayment',
          },
          {
            icons: 'settings',
            nombre: 'Mis Bancos',
            url: '/config/bank/bank',
          },
        ]
      },
      /*{
        icons: 'receipt_long',
        nombre: 'Ver catalogo de proveedores',
        disable: this.dataUser.id,
        url: '/config/verCatalagoProveedor',
        submenus:[]
      },*/
      {
        icons: 'storefront',
        nombre: 'Mis Ordenes',
        disable: this.rolUser == 'proveedor',
        url: '/config/misDespacho',
        submenus:[]
      },
      {
        icons: 'storefront',
        nombre: 'Ventas Vera',
        disable: this.rolUser == 'administrador',
        url: '/config/ventasVictorVera',
        submenus:[]
      },
      {
        icons: 'settings',
        nombre: 'Edicion Productos',
        url: '/config/productos',
        disable: this.rolUser == 'proveedor',
        submenus:[]
      },
      /*{
        icons: 'security',
        nombre: 'Seguridad',
        url: '.',
        submenus:[]
      },*/
      {
        icons: 'account_circle',
        nombre: 'Mi Cuenta',
        disable: ( this.rolUser !== 'visitante' ),
        url: '/config/perfil',
        submenus:[]
      },
      {
        icons: 'settings',
        nombre: 'Configuración',
        disable: this.rolUser == 'administrador',
        url: '.',
        submenus:[
          {
            icons: 'settings',
            nombre: 'Catalago',
            url: '/config/catalago',
          },
          /*{
            icons: 'settings',
            nombre: 'Testimonios',
            url: '/config/testimonios',
          },*/
          {
            icons: 'settings',
            nombre: 'Categorias',
            url: '/config/categorias',
          },
          {
            icons: 'settings',
            nombre: 'Lista de Tallas',
            url: '/config/listaTalla',
          },
          {
            icons: 'settings',
            nombre: 'Productos',
            url: '/config/productos',
          },
          {
            icons: 'settings',
            nombre: 'Provedores',
            url: '/config/provedores',
          },
          {
            icons: 'settings',
            nombre: 'Usuarios',
            url: '/config/usuarios',
          },
          {
            icons: 'settings',
            nombre: 'Administracion Retiros de Dinero de Proveedores',
            url: '/config/adminF/vendorpayment',
          },
          {
            icons: 'settings',
            nombre: 'Pagos de Guias',
            url: '/config/adminF/stateGuia',
          },
          {
            icons: 'settings',
            nombre: 'Paquetes disponibles',
            url: '/config/adminF/recharge',
          },
          {
            icons: 'settings',
            nombre: 'Configuracion',
            url: '/config/configuracion',
          },
          // {
          //   icons: 'settings',
          //   nombre: 'Configuraciones',
          //   url: '/config/admin',
          // },
        ]
      },
      {
        icons: 'help',
        nombre: 'Cursos / Ayuda',
        disable: this.dataUser.id,
        url: '/config/cursos',
        submenus:[]
      },
      /*{
        icons: 'assessment',
        nombre: 'Informes',
        url: '.',
        submenus:[]
      },*/
    ];

    this.menus = _.filter(this.menus, row=>row.disable);

    this.menus2 = [
      {
        icons: 'account_circle',
        nombre: 'Iniciar Sesión',
        disable: this.rolUser === 'visitante',
        url: 'login()',
        submenus:[]
      },
      {
        icons: 'supervisor_account',
        nombre: 'Inicia tu propio negocio',
        disable: this.rolUser === 'visitante',
        url: 'registrar()',
        submenus:[]
      },
      /*{
        icons: 'help',
        nombre: 'Ayuda Material de apoyo',
        disable: true,
        url: 'ayuda()',
        submenus:[]
      },*/
      {
        icons: 'exit_to_app',
        nombre: 'Compartir mi tienda',
        disable: ( this.dataUser.id ) && ( this.rolUser == 'administrador' || this.rolUser == 'vendedor' ),
        url: 'shareTienda()',
        submenus:[]
      },
      {
        icons: 'exit_to_app',
        nombre: 'Recargar Saldo',
        disable: ( this.dataUser.id ) && ( this.rolUser == 'administrador' || this.rolUser == 'vendedor' ),
        url: 'handleRechargeNalance()',
        submenus:[]
      },
      {
        icons: 'exit_to_app',
        nombre: 'Salir',
        disable: this.dataUser.id,
        url: 'salir()',
        submenus:[]
      },

    ];
    this.menus2 = _.filter(this.menus2, row=>row.disable);
  }

  shareTienda(){
    //console.log("***ENTre")
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.urlTienda;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.openSnack('Copiado:' + ' ' + this.urlTienda, 'completado', false);
  }

  navegar( item:any, obj:any = null ){
    //console.log("*", item, item.url[1])
    //if( item.check === true ) for( let row of this.menus ) row.check = false;
    item.check = !item.check;
    if( obj ) obj.check = true;
    if( item.url == 'handleShop()' ) return this.handleShop();
    if( item.submenus ) if( item.submenus.length >0 ) return false;
    if( item.opt ) this.router.navigate(item.url);
    else this.router.navigate([ item.url ]);
    this.sidenav.close();
   //console.log("*SALIR")

  }

  getCategorias(){
    return new Promise( resolve =>{
      this._categorias.get( { where: { cat_activo: 0, cat_padre: null }, limit: 1000 } ).subscribe(( res:any )=>{
        let maps = _.map( res.data, ( row )=>{
          return {
            'nombre': row['cat_nombre'],
            icons: "settings",
            url: [ "/pedidos", row['id'] ],
            opt: true
            //subCategoria: await this.getSubcategoria( row.id )
          }
        })
        resolve( maps )
      },( error )=> resolve( [] ) );
    });
  }

  async getSubcategoria( id:any ){
    return new Promise
    ( resolve =>{
      this._categorias.get( { where: { cat_padre: id, cat_activo: 0 }, limit: 1000 } ).subscribe(( res:any )=>{
        resolve( res.data );
      }, ()=> resolve( false ) );
    });
}

  copiarLinkRegistro(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.urlRegistro;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.openSnack('Copiado:' + ' ' + this.urlRegistro, 'completado', false);
  }

  login(){
    this.router.navigate(['/login']);
    /*const dialogRef = this.dialog.open(LoginComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  handleShop(){
    this.router.navigate(['/pedidos']);
    setTimeout(()=>this.router.navigate(['/pedidos',0]), 1000 );
    //location.reload();
  }

  registrar(){
    this.router.navigate(['/singUp','vendedor','3213692393']);
    /*const dialogRef = this.dialog.open(RegistroComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  handleRechargeNalance(){
    //("***838")
    this.router.navigate(["/config/recharge"]);
  }

  getAlert(){
    this._notificaciones.get( { where: { user: this.dataUser.id, tipoDe: [ 1, 2 ], view: false }}).subscribe( async ( res:any ) =>{
      res = res.data;
      this.listAlert.push( ...res )
      const result:any = await this.getMas();
      this.listAlert.push( ...result )
      if( this.namePorcentaje == "dropshipping básico"){
        this.listAlert.unshift(
          {
            id: this._tools.codigo(),
            titulo: "Importante",
            descripcion: "Cuenta de Ganancias de Ventas por porcentaje "+ this.dataUser.porcentaje + "%",
            tipoDe: 2
          }
        );
      }
      //console.log("****684", this.listAlert)
    });
  }

  getMas(){
    return new Promise( resolve =>{
      this._notificaciones.get( { where: { tipoDe: 3, view: false, user:null }}).subscribe(( res:any ) =>{
        resolve( res.data );
      });
    })
  }

  crear( obj:any ){
    const dialogRef = this.dialog.open(FormtestimoniosComponent,{
      width: '731px',
      data: {datos: { vista: "ver", ...obj }}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      this.listAlert = this.listAlert.find((row:any) => row.id !== obj.id );
    });
  }

  closeAlert( item ){
    this.listAlert = this.listAlert.filter( ( row:any ) => row.id !== item.id ) || [];
    //console.log(this.listAlert)
  }

  salir( opt:boolean =  false ){
    localStorage.removeItem('user');
    let accion = new UserAction( this.dataUser, 'delete');
    this._store.dispatch(accion);
    if( opt == false ){
      accion = new UserCabezaAction( {} , 'drop' );
      this._store.dispatch(accion);
      accion = new UserprAction( {} , 'drop' );
      this._store.dispatch(accion);
      localStorage.removeItem('APP');
    }
    setTimeout( () => location.reload(), 2000 );
  }

  openTienda( opt:string ){
    //console.log( opt )
    if( opt == 'visitante' )
    {
      /*let accion = new UserprAction( this.dataUser, 'post' );
      this._store.dispatch(accion);
      this.router.navigate(['/', this.dataUser.usu_usuario ]);
      setTimeout( () =>{
        this.salir( true );
      }, 1000 );*/
      window.open( this.urlTienda, "Ver Como Visitante");
    }
    else if( opt == 'distribuidor') {
      /*
      this.router.navigate(['/pedidos' ]);
      let accion = new UserAction( this.dataUser.id ? this.dataUser : this.userPr, 'post');
      this._store.dispatch( accion );
      accion = new UserCabezaAction( {} , 'drop' );
      this._store.dispatch(accion);
      setTimeout( ()=> location.reload(), 1000 );
      */
     window.open( this.urlDistribuidor, "Ver Como Distribuidor");
     //this.router.navigate([this.urlTienda]);
    }
    else if ( opt == 'proveedor'){
      this.router.navigate(['/config/misDespacho' ]);
      let accion = new UserAction( this.userPr, 'post');
      this._store.dispatch( accion );
      accion = new UserprAction( {} , 'drop' );
      this._store.dispatch(accion);
      setTimeout( ()=> location.reload(), 1000 );
    }
    else{
      let accion = new UserprAction( this.dataUser, 'post' );
      this._store.dispatch( accion );
      this.dataUser.usu_perfil = {
        createdAt: "2021-02-26T18:35:35.893Z",
        est_clave_int: 0,
        id: 1,
        prf_descripcion: "vendedor",
        prf_fec_actualiz: "",
        prf_usu_actualiz: "",
        updatedAt: "2021-02-26T18:35:35.893Z"
      };
      //console.log( this.dataUser)
      let clon:any = _.clone( this.dataUser );
      accion = new UserAction( {}, 'delete');
      this._store.dispatch( accion );
      accion = new UserAction( clon, 'post');
      this._store.dispatch( accion );
      //console.log( clon, this.dataUser)
      this.router.navigate(['/pedidos' ]);
      setTimeout( ()=> location.reload(), 1000 );
      return false;
    }
  }

  articuloSubmit(){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: {datos: {}}
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
