import { Component, OnDestroy, ChangeDetectorRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from '../registro/registro.component';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Store } from '@ngrx/store';
import { CART } from 'src/app/interfaces/sotarage';
import { CartAction, UserAction } from 'src/app/redux/app.actions';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showFiller = false;
  public mobileQuery: any;
  breakpoint: number;
  private _mobileQueryListener: () => void;
  menus:any = [];
  menus2:any = [];
  dataUser:any = {};
  rolUser:any = {};
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

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher, private router: Router,
    public dialog: MatDialog,
    private _model: ServiciosService,
    private _store: Store<CART>,
    private _user: UsuariosService

  ) { 

    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCart = store.cart || [];
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.submitChat();
    });

    this.mobileQuery = media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;


  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.onResize(null);
    if(Object.keys(this.dataUser).length > 0 ) {
      this.rolUser = this.dataUser.usu_perfil.prf_descripcion;
      this.getInfoUser();
    }
    else this.rolUser = 'visitante';
    this.listMenus();
  }

  getCarrito(){
    
  }

  deleteCart(idx:any, item:any){
    this.listCart.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
  }

  submitChat(){
    let texto:string;
    this.data.total = 0;
    for(let row of this.listCart){
      texto+= ` productos: ${ row.titulo } codigo: ${ row.codigo } foto: ${ row.foto } cantidad: ${ row.cantidad } color ${ row.color || 'default'}`;
      this.data.total+= row.costoTotal || 0;
    }
    if(this.dataUser.id){
        this.urlwhat = `https://wa.me/${ this.dataUser.usu_indicativo }${ this.dataUser.usu_telefono }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }else{
      if(this.userId) this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo }${ this.userId.usu_telefono }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
      else this.urlwhat = `https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }
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
  
  listMenus(){
    this.menus = [
      {
        icons: 'home',
        nombre: 'Inicio',
        disable: true,
        url: '.',
        submenus:[]
      },
      {
        icons: 'menu_book',
        nombre: 'Productos',
        disable: true,
        url: '/pedidos',
        submenus:[]
      },
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
        disable: this.rolUser !== 'visitante',
        url: '/config/cobros',
        submenus:[]
      },
      {
        icons: 'local_grocery_store',
        nombre: 'Mis Ventas',
        disable: this.rolUser !== 'visitante',
        url: '/config/ventas',
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
          }
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
      {
        icons: 'supervisor_account',
        nombre: 'Vende para nosotros',
        disable: this.rolUser === 'visitante',
        url: 'registrar()',
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

  salir(){
    localStorage.removeItem('user');
    let accion = new UserAction( this.dataUser, 'delete');
    this._store.dispatch(accion);
    location.reload();
  }

}
