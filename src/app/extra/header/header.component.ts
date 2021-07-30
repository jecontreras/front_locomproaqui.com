import { Component, OnDestroy, ChangeDetectorRef, OnInit, VERSION, ViewChild, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../components/login/login.component';
import { RegistroComponent } from '../../components/registro/registro.component';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { BuscarAction, CartAction, UserAction, UserCabezaAction, UserprAction } from 'src/app/redux/app.actions';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';
import { FormventasComponent } from 'src/app/dashboard-config/form/formventas/formventas.component';
import { FormtestimoniosComponent } from 'src/app/dashboard-config/form/formtestimonios/formtestimonios.component';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';

const URLFRON = environment.urlFront;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showFiller = false;

  @ViewChild('nav',{static: false} ) private nav: any
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
  isHandset$:any;
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

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher, private router: Router,
    public dialog: MatDialog,
    private _store: Store<CART>,
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _notificaciones: NotificacionesService,
    private _venta: VentasService,
    private _categorias: CategoriasService

  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCart = store.cart || [];
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.userPr = store.userpr || {};
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
    console.log( this.namePorcentaje )
    setInterval(()=> {
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.userId.id ) {
        color = this.userId.usu_color || "#02a0e3";
        this.urlLogo = this.userId.usu_imagen;
      }
      this.nav.nativeElement.style.backgroundColor = color
    }, 100 );
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
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
      console.log(error)
    }
    console.log( this.rolUser1 )
    this.listMenus();
    if( this.dataUser.id )this.getCarrito();
    if( this.dataUser.id ) this.getAlert();
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
    }, 5000);
  }

  pedidosSubmit(){
    if( !this.dataUser.id ) return window.open( this.urlwhat );
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
    console.log( this.porcentajeUser,this.namePorcentaje )
    for(let row of this.listCart){
      //texto+= ` productos: ${ row.titulo } codigo: ${ row.codigo } talla: ${ row.tallaSelect } cantidad: ${ row.cantidad } precio: ${ row.costo } precio Total: ${ row.costoTotal } foto: ${ row.foto } color ${ row.color || 'default'}`;
      texto+= ` ${ row.foto } talla ${ row.tallaSelect } color ${ row.color || 'default' } ref:${ row.codigo } y el valor ${ this._tools.monedaChange( 3, 2, row.costo ) } `;
      this.data.total+= row.loVendio * row.cantidad || 0;
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
    if(obj.url == 'login()') this.login();
    if(obj.url == 'registrar()') this.registrar();
    if(obj.url == 'salir()') this.salir();
  }

  btnCarrito(){

  }
  
  async listMenus(){
    let submenus = await this.getCategorias();
    console.log( submenus );
    this.menus = [
      {
        icons: 'home',
        nombre: 'Inicio',
        disable: true,
        url: '/pedidos',
        submenus:[]
      },
      {
        icons: 'menu_book',
        nombre: 'Productos',
        disable: this.rolUser != 'proveedor',
        disabled: true,
        url: '/pedidos',
        submenus: submenus
      },
      /*{
        icons: 'announcement',
        nombre: 'Testimonios',
        disable: true,
        url: '/testimonio',
        submenus:[]
      },*/
      {
        icons: 'account_circle',
        nombre: 'Mi Cuenta',
        disable: this.rolUser !== 'visitante',
        url: '/config/perfil',
        submenus:[]
      },
      /*{
        icons: 'shop',
        nombre: 'Mis Bancos',
        url: '/config/bancos',
        submenus:[]
      },*/
      {
        icons: 'shop',
        nombre: 'Mis Cobros',
        disable: this.rolUser !== 'visitante' && this.rolUser != 'proveedor',
        url: '/config/cobros',
        submenus:[]
      },
      {
        icons: 'local_grocery_store',
        nombre: 'Mis Ventas',
        disable: this.rolUser !== 'visitante' && this.rolUser != 'proveedor',
        url: '/config/ventas',
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
        disable: this.rolUser == 'administrador' || this.rolUser == 'subAdministrador' || this.rolUser == 'lider',
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
        icons: 'receipt_long',
        nombre: 'Ver catalogo de proveedores',
        disable: this.dataUser.id,
        url: '/config/verCatalagoProveedor',
        submenus:[]
      },
      {
        icons: 'storefront',
        nombre: 'Mis Despacho',
        disable: this.rolUser == 'proveedor',
        url: '/config/misDespacho',
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
        nombre: 'Iniciar Sección',
        disable: this.rolUser === 'visitante',
        url: 'login()',
        submenus:[]
      },
      /*{
        icons: 'supervisor_account',
        nombre: 'Inicia tu propio negocio',
        disable: this.rolUser === 'visitante',
        url: 'registrar()',
        submenus:[]
      },*/
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

  getCategorias(){
    return new Promise( resolve =>{
      this._categorias.get( { where: { cat_activo: 0, cat_padre: null }, limit: 1000 } ).subscribe(( res:any )=>{
        let maps = _.map( res.data, ( row )=>{
          return {
            'nombre': row['cat_nombre'],
            icons: "settings",
            url: [ "/pedido", row['id'] ],
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
    const dialogRef = this.dialog.open(LoginComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  registrar(){
    const dialogRef = this.dialog.open(RegistroComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getAlert(){
    this._notificaciones.get( { where: { user: this.dataUser.id, tipoDe: [ 1, 2 ], view: false }}).subscribe(( res:any ) =>{
      res = res.data;
      this.listAlert = res;
    });
  }

  crear( obj:any ){
    const dialogRef = this.dialog.open(FormtestimoniosComponent,{
      width: '731px',
      data: {datos: { vista: "ver", ...obj }}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.listAlert = this.listAlert.find((row:any) => row.id !== obj.id );
    });
  }

  closeAlert( item ){
    this.listAlert = this.listAlert.find( ( row:any ) => row.id !== item.id );
  }

  salir( opt:boolean =  false ){
    localStorage.removeItem('user');
    localStorage.removeItem('APP');
    let accion = new UserAction( this.dataUser, 'delete');
    this._store.dispatch(accion);
    if( opt == false ){
      accion = new UserCabezaAction( {} , 'drop' );
      this._store.dispatch(accion);
    }
    location.reload();
  }

  openTienda( opt:string ){
    console.log( opt )
    if( opt == 'visitante' ) 
    {
      let accion = new UserprAction( this.dataUser, 'post' );
      this._store.dispatch(accion);
      this.router.navigate(['/', this.dataUser.usu_usuario ]);
      setTimeout( () =>{
        this.salir( true );
      }, 1000 );
    }
    else if( opt == 'distribuidor') {
      this.router.navigate(['/pedidos' ]);
      let accion = new UserAction( this.dataUser.id ? this.dataUser : this.userPr, 'post');
      this._store.dispatch( accion );
      accion = new UserCabezaAction( {} , 'drop' );
      this._store.dispatch(accion);
      setTimeout( ()=> location.reload(), 1000 );
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
      console.log( this.dataUser)
      let clon:any = _.clone( this.dataUser );
      accion = new UserAction( {}, 'delete');
      this._store.dispatch( accion );
      accion = new UserAction( clon, 'post');
      this._store.dispatch( accion );
      console.log( clon, this.dataUser)
      this.router.navigate(['/pedidos' ]);
      setTimeout( ()=> location.reload(), 1000 );
      return false;
    }
  }

}
