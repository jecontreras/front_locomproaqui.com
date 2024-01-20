import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { CartAction, BuscadorAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToolsService } from 'src/app/services/tools.service';
import  { SocialAuthService, FacebookLoginProvider, SocialUser }  from 'angularx-social-login';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

declare var ePayco: any;

const URLFRONT = environment.urlFront;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  showFiller = false;
  public mobileQuery: any;
  breakpoint: number;
  private _mobileQueryListener: () => void;
  urlwhat:string;
  data:any = {};
  listCart: any = [];
  events: string[] = [];
  opened:boolean;
  dataUser:any = {};
  rolUser:any = {};
  userId:any;
  buscador:string;
  tiendaInfo:any = {};
  disableBtn:boolean = false;
  texto:string; 
  
  socialUser: SocialUser;
  isLoggedin: boolean = null;

  constructor(
    public media: MediaMatcher,
    public changeDetectorRef: ChangeDetectorRef,
    private _store: Store<CART>,
    private Router: Router,
    private _tools: ToolsService,
    private socialAuthService: SocialAuthService,
    private _user: UsuariosService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCart = store.cart || [];
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.tiendaInfo = store.configuracion || {};
      this.submitChat();
    });
  }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;
    this.socialAuthService.authState.subscribe( async (user) => {
      let result = await this._user.initProcess( user );
      console.log("**********", user, result )
      this.socialUser = user;
      this.isLoggedin = (user != null);
      }
    );
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


  signOut(): void {
    this.socialAuthService.signOut();
  }

  deleteCart(idx:any, item:any){
    this.listCart.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
  }

  submitChat(){
    let texto:string =  '';
    this.data.total = 0;
    for(let row of this.listCart){
      texto+= ` productos: ${ row.titulo } foto: ${ row.foto } codigo: ${ row.codigo } cantidad: ${ row.cantidad } color ${ row.color || 'default'}`;
      this.data.total+= row.costoTotal || 0;
    }
    this.texto = texto;
    //console.log(this.dataUser, this.userId)
    if(this.userId.id){
      this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ this.userId.usu_telefono || ( this.tiendaInfo.numeroCelular || '3208429429' ) }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }else{
      this.urlwhat = `https://wa.me/57${ this.tiendaInfo.numeroCelular || '3208429429' }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en comprar los siguientes ${texto}`
    }
  }

  buscarArticulo(){
    let data:any = {
      search: this.buscador
    };

    let accion = new BuscadorAction( data, 'post');
    this._store.dispatch( accion );
    this.Router.navigate( ['/tienda/productos'] );
  }

  openEpayco(){
    if( this.disableBtn ) return false;
    this.disableBtn = true;
    const handler:any = ePayco.checkout.configure({
      key: '90506d3b72d22b822f53b54dcf22dc3a',
      test: true
    });

    let data:any ={
      //Parametros compra (obligatorio)
      name: "Compra de articulos",
      description: this.texto,
      invoice: this.codigo(),
      currency: "cop",
      amount: this.data.total,
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "eng",
      //Onpage="false" - Standard="true"
      external: "true", 
      //Atributos opcionales
      extra1: "extra1",
      extra2: "extra2",
      extra3: "extra3",
      confirmation: URL+"/paquete/comprado",
      //confirmation: "https://f37798ba.ngrok.io/paquete/comprado",
      response: URLFRONT,

      //Atributos cliente
      name_billing: '',
      address_billing: '',
      type_doc_billing: "cc" || '',
      mobilephone_billing: '',
      number_doc_billing: ''
    }
    this.createPago( data.invoice );
    handler.open(data)
    setTimeout(()=>{
      this.disableBtn = false;
    }, 5000)
  }

  createPago( id:string ){
    let data:any = {
      usuario: this.userId.id,
      x_id_factura: id
    };
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }

}
