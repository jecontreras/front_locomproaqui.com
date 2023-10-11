import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import  { SocialAuthService, FacebookLoginProvider, SocialUser }  from 'angularx-social-login';

@Component({
  selector: 'app-checkt-dialog',
  templateUrl: './checkt-dialog.component.html',
  styleUrls: ['./checkt-dialog.component.scss']
})
export class ChecktDialogComponent implements OnInit {
  data:any = {};
  disabled:boolean = false;
  valor:number = 0;
  dataUser:any = {};
  tiendaInfo:any = {};

  constructor(
    public dialogRef: MatDialogRef<ChecktDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private _user: UsuariosService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private socialAuthService: SocialAuthService,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      if( store.usercabeza ) this.dataUser = store.usercabeza || {}
      this.tiendaInfo = store.usercabeza || {};
    });
  }

  ngOnInit(): void {
    console.log( this.datas );
    this.datas = this.datas.datos || {};
    this.data.talla = this.datas.talla;
    this.data.colorSelect = this.datas.colorSelect || '';
    this.data.cantidadAd = this.datas.cantidadAd || 1;
    this.data.costo = this.datas.costo || 105000;
    this.data.opt = this.datas.opt;
    this.suma();
    this.socialAuthService.authState.subscribe( async (user) => {
      let result = await this._user.initProcess( user );
      console.log("**********", user, result )
      }
    );
  }

  async finalizando(){
    if( this.disabled ) return false;
    this.disabled = true;
    let validador = await this.validador();
    if( !validador ) { this.disabled = false; return false;}
    let data:any = {
      "ven_tipo": "whatsapp",
      "usu_clave_int": this.tiendaInfo.id,
      "ven_usu_creacion": this.tiendaInfo.usu_email,
      "ven_fecha_venta": moment().format("DD/MM/YYYY"),
      "cob_num_cedula_cliente": this.data.cedula,
      "ven_nombre_cliente": this.data.nombre,
      "ven_telefono_cliente": this.data.telefono,
      "ven_ciudad": this.data.ciudad,
      "ven_barrio": this.data.barrio,
      "ven_direccion_cliente": this.data.direccion,
      "ven_cantidad": this.datas.cantidadAd || 1,
      "ven_tallas": this.data.talla,
      "ven_precio": this.datas.pro_uni_venta,
      "ven_total": this.data.costo || 0,
      "ven_ganancias": 0,
      "ven_observacion": this.data.colorSelect,
      "ven_estado": 0,
      "create": moment().format("DD/MM/YYYY"),
      "apartamento": this.data.apartamento || '',
      "departamento": this.data.departamento || '',
      "ven_imagen_producto": this.datas.foto,
      "pro_clave_int": this.datas.id,
      "nombreProducto": this.datas.pro_nombre

    };
    console.log("*****88", data);
    //await this.crearUser();
    data.usu_clave_int = this.dataUser.id;
    await this.nexCompra( data );
    this.disabled = false;
    this._tools.presentToast("Exitoso Tu pedido esta en proceso. un accesor se pondra en contacto contigo!");
    setTimeout(()=>this._tools.tooast( { title: "Tu pedido esta siendo procesado "}) ,3000);
    this.mensajeWhat();
    //this._router.navigate(['/tienda/detallepedido']);
    this.dialogRef.close('creo');

  }

  async crearUser(){
    let filtro = await this.validandoUser( this.data.cedula );
    if( filtro ) { return false; }
    let data:any = {
      usu_clave: this.data.cedula,
      usu_confir: this.data.cedula,
      usu_usuario: this.data.cedula,
      usu_email: this.data.cedula,
      usu_nombre: this.data.nombre,
      usu_documento: this.data.cedula
    };
    let result = await this.creandoUser( data );
    console.log("********", result);
    if( !result ) return false;
    return true;
  }

  validandoUser( documento:any ){
    return new Promise( resolve => {
      this._user.get( { where: { usu_documento: documento } } ).subscribe( ( res:any )=> {
        res = res.data[0];
        if( !res ) resolve( false );
        let accion:any = new UserAction( res , 'post' );
        this._store.dispatch( accion );
        this.urlRotulado();
        resolve( true );
      });
    });
  }

  creandoUser( data:any ){
    return new Promise( resolve => {
      this._user.create( data ).subscribe( ( res:any )=> {
        if( !res.success ) { resolve ( false ) }
        let accion:any = new UserAction( res.data , 'post' );
        this._store.dispatch( accion );
        this.urlRotulado();
        resolve( true );
      });
    });
  }

  urlRotulado(){

  }

  suma(){
    this.data.costo = ( this.data.opt == true ? ( this.datas.pro_uni_venta * 2 || 210000 ) - 20000 : ( this.datas.pro_uni_venta * this.data.cantidadAd )  || 105000 )
    console.log( this.datas )
  }

  mensajeWhat(){
    let mensaje: string = ``;
    let validateNum = String( this.dataUser.usu_telefono );
    if( validateNum.length <= 10 ) validateNum = "+57"+validateNum;
    mensaje = `https://wa.me/${ validateNum }?text=${encodeURIComponent(`
      Hola Servicio al cliente, como esta, saludo cordial,
      para confirmar adquiere este producto
      Nombre de cliente: ${ this.data.nombre }
      *celular:*${ this.data.telefono }
      *talla:* ${ this.data.talla }
      *Color:* ${ this.data.colorSelect }
      *cantidad:* ${ this.data.cantidadAd || 1 }
      Ciudad: ${ this.data.ciudad }
      ${ this.data.barrio }
      Dirección: ${ this.data.direccion }
      ${ this.datas.pro_nombre }

      TOTAL FACTURA ${( this.data.costo )}
      🤝Gracias por su atención y quedo pendiente para recibir por este medio la imagen de la guía de despacho`)}`;
    console.log(mensaje);
    window.open(mensaje);
  }

  validador(){
    if( !this.data.nombre ) { this._tools.tooast( { title: "Error falta el nombre ", icon: "error"}); return false; }
    if( !this.data.telefono ) { this._tools.tooast( { title: "Error falta el telefono", icon: "error"}); return false; }
    if( !this.data.direccion ) { this._tools.tooast( { title: "Error falta la direccion ", icon: "error"}); return false; }
    if( !this.data.ciudad  ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    if( !this.data.barrio ) { this._tools.tooast( { title: "Error falta el barrio ", icon: "error"}); return false; }
    if( !this.data.talla ) { this._tools.tooast( { title: "Error falta la talla ", icon: "error"}); return false; }
    return true;
  }

  async nexCompra( data:any ){
    return new Promise( resolve =>{
      this._ventas.create2( data ).subscribe(( res:any )=>{
        this.data.id = res.id;
        resolve( true );
      },( error:any )=> {
        //this._tools.presentToast("Error de servidor")
        resolve( false );
      });
    })
  }

  logearFacebook(){
    this.socialAuthService.signIn( FacebookLoginProvider.PROVIDER_ID );
  }

}
