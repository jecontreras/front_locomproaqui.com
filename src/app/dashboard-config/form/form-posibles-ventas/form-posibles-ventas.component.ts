import { Component, OnInit, Inject } from '@angular/core';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import * as moment from 'moment';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';
import { CartAction } from 'src/app/redux/app.actions';
@Component({
  selector: 'app-form-posibles-ventas',
  templateUrl: './form-posibles-ventas.component.html',
  styleUrls: ['./form-posibles-ventas.component.scss']
})
export class FormPosiblesVentasComponent implements OnInit {
  data: any = {};
  clone: any = {};
  id: any;
  titulo: string = "Ver Posible Venta";
  dataUser: any = {};
  disabledButton: boolean = false;
  disabled: boolean = false;
  listTallas: any = [];
  mensajeWhat: string;

  disableBtnFile: boolean = false;
  disabledEtiqueta: boolean = true;
  urlImagen: any;
  opcionCurrencys: any = {};
  disableSpinner:boolean = true;
  porcentajeMostrar: any;
  tablet:any = {
    header: ["Mensaje","Transp","Origen / Destino","Unid","Total Kilos","Valoración","Flete","Valor Tarifa","Total","Tiempos Aprox"],
    listRow: []
  };

  listCarrito: any = [];
  progreses:boolean = false;
  textData:string = "";
  namePorcentaje: string;
  listCiudades:any = DANEGROUP;
  keyword = 'name';
  errorCotisa:string;
  coinShop:boolean = false;
  rolUser:string;
  proveedorContacto:string;
  proveedorNombre: string;
  productoFoto: string;

  constructor(
    private _ventas: VentasService,
    public dialogRef: MatDialogRef<FormPosiblesVentasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools: ToolsService,
    private _producto: ProductoService,
    private _store: Store<STORAGES>,
    private _notificacion: NotificacionesService,
  ) {
    this.data = _.clone(this.datas.datos);
    this.id = this.data.id;
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
     });
  }

  async ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.getDetails();
    await this.getCiudades();
    this.listCiudades = this.listCiudades.filter( ( row:any )=> row.code > 0 );
    this.disabledButton = true
  }

  getDetails(){
    this._ventas.getPossibleSales({ where: { id: this.id }}).subscribe(res=>{
      res = res.data[0];
      this.data = res;
      this.data.cob_num_cedula_cliente = this.data.ven_telefono_cliente;
      this.disableSpinner = false;
      this.getArticulo();
    });
  }

  getArticulo(){
    this._producto.get( { where: { id: this.data.pro_clave_int } } ).subscribe( res =>{
      res = res.data[0];
      res.codigoImg = this.data.nombreProducto;
      res.cantidad = this.data.ven_cantidad;
      res.colorSelect = this.data.ven_observacion;
      res.color = this.data.ven_observacion;
      res.tallaSelect = this.data.ven_tallas;
      res.costo = res.pro_vendedorCompra;
      res.loVendio = this.data.ven_precio;
      res.bodegaName = res.pro_usu_creacion.usu_usuario,
      this.listCarrito.push( res );
      console.log("****79", this.listCarrito )
      this.proveedorContacto = res.pro_usu_creacion.usu_telefono
      this.proveedorNombre = res.bodegaName
      this.productoFoto = res.foto
    });
  }

  async getCiudades(){
    return new Promise( resolve => {
      this._ventas.getCiudades( { where: { }, limit: 100000 } ).subscribe( ( res:any )=>{
        this.listCiudades = res.data;
        resolve( this.listCiudades );
      });
    });
  }

  async precioRutulo( ev:any ){
    console.log( ev );
    if( this.data.ven_numero_guia ) return this._tools.confirm( { title: "Lo sentimos tienes una guia generada ya", detalle: "1.Toca cancelar la guia si te quedo mal. 2.hablar con el servicio al cliente", icon: "error" } );
    // if( this.disabledButton ) return false;
    // this.disabledButton = true;
    if( this.id && ( this.data.ven_estado == 1 && this.data.ven_estado == 2 && this.data.ven_estado == 3 && this.data.ven_estado == 4 ) ) { this.disabledButton = false; return false;}
    if( ev.state ) if( ev ) this.data.ciudadDestino = ev;
    let result:any;
    this.tablet.listRow = [];
    if( !this.data.ciudadDestino ) { return false;}
    if( !this.data.ciudadDestino.code ) { return false;}
    this.data.codeCiudad = this.data.ciudadDestino.code;
    this.data.ciudadDestino = this.data.ciudadDestino.name;
    this.progreses = true;
    result = await this.PrecioContraEntrega();
    console.log( result, this.data )
    this.progreses = false;
    this.disableSpinner = false;
    this.disabledEtiqueta= false;
  }

  async PrecioContraEntrega(){
    return new Promise( resolve =>{

      this.data.pesoVolumen = ( ( parseFloat( this.data.alto || 3 ) * parseFloat( this.data.largo || 13 ) * parseFloat( this.data.ancho || 10 ) ) / 5000 ) || 1;
      this.data.pesoVolumen = Math.round( this.data.pesoVolumen || 1 );
      for( let row of this.listCarrito ){
        this.textData+= `${ row.cantidad } ${ row['codigoImg'] } ${ row.tallaSelect },
        `
      }
      let data:any ={
        "selectEnvio": "contraEntrega",
        "selectTds": true,
        "idCiudadDestino": String( this.data.codeCiudad ),
        "idCiudadOrigen": "54001000",
        "valorMercancia": Number( this.data.ven_total ),
        "valorProductos": Number( this.data.ven_totalDistribuidor - 10000 ),
        "fechaRemesa": moment( this.data.fecha ).format( "YYYY-MM-DD" ),
        "idUniSNegogocio": 1,
        "numeroUnidad": 1,
        "pesoReal": ( this.listCarrito.length ) || 1,
        "pesoVolumen": this.data.pesoVolumen || 1,
        "alto": 9,
        "largo": 28,
        "ancho": 21,
        "tipoEmpaque": "",
        "drpCiudadOrigen": "CUCUTA-NORTE DE SANTANDER",
        "txtIdentificacionDe": this.dataUser.usu_documento || 1090519754,
        "txtTelefonoDe": this.dataUser.usu_telefono,
        "txtDireccionDe": this.dataUser.usu_direccion,
        "txtCod_Postal_Rem": 540001,
        "txtEMailRemitente": this.dataUser.usu_email,
        "txtPara": this.data.ven_nombre_cliente,
        "txtIdentificacionPara": this.data.cob_num_cedula_cliente,
        "drpCiudadDestino": this.data.ciudadDestino,
        "txtTelefonoPara": this.data.ven_telefono_cliente,
        "txtDireccionPara": this.data.ven_direccion_cliente,
        "txtDice": this.textData,
        "txtNotas": "ok",
      };

      this._ventas.getFleteValor( data ).subscribe(( res:any )=>{
        this.tablet.listRow = res.data || [];
        this.tablet.listRow = _.filter( this.tablet.listRow, ( item:any )=> item.fleteTotal > 0 );
        console.log( "****", res, this.tablet)
        try {
          this.selectTrans( res.data[2] );
        } catch (error) {}
        resolve( true );


        //if( this.data.fleteValor == 0 ) { this.data.ven_tipo = "pago_anticipado"; this._tools.confirm( { title: "Novedad", detalle: "Lo sentimos no tenemos Cubrimiento para esa zona (CONTRA ENTREGA)", icon: "warning" } ); return resolve( false ) }
        /*else {
          this.data.ven_tipo = "contraentrega";
          if( this.porcentajeMostrar == 40 ) this._tools.confirm( { title: "Completado", detalle: "El valor del envio para la ciudad "+ this.data.ciudadDestino.name + " es de " + this._tools.monedaChange( 3, 2, this.data.fleteValor ), icon: "succes" } );
          this.suma();
          resolve( true );
        }*/
      },()=>resolve( false ));
    });
  }

  selectTrans( item, opt = false ){
    if( this.data.ven_numero_guia && !opt) return false;
    this.data.transportadoraSelect = item.slug;
    if( this.data.transportadoraSelect === "CORDINADORA" || this.data.transportadoraSelect === "ENVIA" || this.data.transportadoraSelect === "INTERRAPIDISIMO" || this.data.transportadoraSelect === "TCC") {
      this.data.ven_tipo = "contraEntrega";
    }else this.data.ven_tipo = "envioNormal";
    console.log( this.tablet.listRow)
    for(let row of this.tablet.listRow ) row.check = false;
    item.check = !item.check;
    this.data.fleteValor = item.fleteTotal;
    this.data.fleteManejo = item.fleteManejo;
    this.data.flteTotal = item.fleteTotal;
    this.data.historySettlementFletes = JSON.stringify( item );
    this.porcentajeMostrar = 
    this.suma();
    //if( this.id ) this.submit();
    console.log(" selectTrans(", this.data)
    this.disabledButton = false
    return true;
  }

  suma() {
    //console.log( this.data, this.listCarrito, this.namePorcentaje );
    //if( this.superSub == false && this.id ) return false;
    //EDU se comenta por que abjo  se calcula
    // if( this.id ) return this.sumaIds();

    let total: number = 0;
    let total1: number = 0;
    this.data.ven_ganancias = 0;
    //console.log( this.listCarrito)
    for (let row of this.listCarrito) {
      if (!row.costo || !row.cantidad) continue;
      total += ( Number( row.costo ) * Number( row.cantidad ) );
      if( !row.id ) row.loVendio = row.costoTotal;
      if( row.costoTotal === 0 ) row.costoTotal = ( row.costo * row.cantidad ) || 0;
      total1 += ( Number( row.loVendio ) );
      //console.log("********", row );
      //EDU se ajusta por manera definida por victor
      // if ( this.namePorcentaje == "dropshipping básico" ) row.comision = ( row.costoTotal * ( this.dataUser.porcentaje || 10 ) / 100 );
      // else

      //console.log("ven_ganacias",row.loVendio, row.costo)
      this.data.ven_ganancias+= ( ( row.loVendio  ) - row.costo ) || 0;

    }

    this.data.ven_totalDistribuidor = total;
    this.data.ven_total = total1;
    //calcular ganancias
    console.log("this.data.ven_ganancias - this.data.fleteValor", this.data.ven_ganancias, this.data.fleteValor)
    this.data.ven_ganancias = this.data.ven_ganancias - this.data.fleteValor
    console.log("suma ven_ganancias", this.data.ven_ganancias)
    //console.log( this.dataUser, this.namePorcentaje )
    //EDU se comenta- por que el procesos debe ser de la manera definida por victor
    // if ( this.namePorcentaje == "dropshipping básico" ) this.data.ven_ganancias = (total * ( this.dataUser.porcentaje || 10 ) / 100 );
    // else {
    //   if( this.data.cubreEnvio == 'tienda') {
    //     this.data.ven_ganancias = ( ( this.data.ven_ganancias - ( this.data.fleteValor || 0  ) ) || 0 );
    //     if( this.data.ven_ganancias <= 0 ) {
    //       this.data.ven_total = this.data.ven_total + ( this.data.fleteValor || 0 ) ;
    //       this.data.ven_ganancias = 0;
    //     }
    //   }
    //   else this.data.ven_total = this.data.ven_total + ( this.data.fleteValor || 0 ) ;
    // }
  }

  sumaIds() {
    //console.log( this.data, this.listCarrito, this.namePorcentaje );
    //if( this.superSub == false && this.id ) return false;
    let total: number = 0;
    let total1: number = 0;
    this.data.ven_ganancias = 0;
    //console.log( this.listCarrito)
    let namePorcentaje = this.data.usu_clave_int.categoriaPerfil;
    for (let row of this.listCarrito) {
      if (!row.costo || !row.cantidad) continue;
      total += ( Number( row.costo ) * Number( row.cantidad ) );
      if( !row.id ) row.loVendio = row.costoTotal;
      if( row.costoTotal === 0 ) row.costoTotal = ( row.costo * row.cantidad ) || 0;
      total1 += ( Number( row.loVendio ) );
      //console.log("********", row );
      if ( namePorcentaje == 1 ) row.comision = ( row.costoTotal * ( this.dataUser.porcentaje || 10 ) / 100 );
      else this.data.ven_ganancias+= ( ( row.loVendio  ) - row.costoTotal ) || 0;

    }

    this.data.ven_totalDistribuidor = total;
    this.data.ven_total = total1;
    //console.log( this.dataUser, namePorcentaje )
    if ( namePorcentaje == 1 ) this.data.ven_ganancias = (total * ( this.dataUser.porcentaje || 10 ) / 100 );
    else {
      if( this.data.cubreEnvio == 'tienda') {
        this.data.ven_ganancias = ( ( this.data.ven_ganancias - ( this.data.fleteValor || 0  ) ) || 0 );
        if( this.data.ven_ganancias <= 0 ) {
          this.data.ven_total = this.data.ven_total + ( this.data.fleteValor || 0 ) ;
          this.data.ven_ganancias = 0;
        }
      }
      else this.data.ven_total = this.data.ven_total + ( this.data.fleteValor || 0 ) ;
    }
  }

  onChangeSearch( ev:any ){
    //console.log( ev )
  }


  async submit() {
    if ( this.listCarrito.length == 0 ) return this._tools.tooast({ title: "Debe existir al menos un articulo seleccionado", icon: "warning" });
    if ( !this.data.ciudadDestino ) return this._tools.tooast({ title: "Tiene que Seleccionar una ciudad de destino", icon: "warning" });
    if( !this.data.transportadoraSelect ) return this._tools.tooast({ title: "Tienes que seleccionar por medio de envio lo vas a enviar ( Obligatorio )", icon: "warning" });
    if (this.dataUser.empresa) {
      if (this.dataUser.empresa.id != 1) this.data.ven_subVendedor = 1;
      this.data.ven_empresa = this.dataUser.empresa.id;
    } else this.data.ven_empresa = 1;

    if( this.data.ciudadDestino.code ){
      this.data.codeCiudad = this.data.ciudadDestino.code;
      this.data.ciudadDestino = this.data.ciudadDestino.name;
    }
    let data = {
      "ven_tipo": "contraEntrega",
      "usu_clave_int": this.dataUser.id,
      "ven_usu_creacion": this.dataUser.usu_email,
      "ven_fecha_venta": this.data.ven_fecha_venta,
      "cubreEnvio": "tienda",
      "ven_ganancias": this.data.ven_ganancias,
      "ven_totalDistribuidor": this.data.ven_totalDistribuidor,
      "ven_total": this.data.ven_total,
      "fleteValor": this.data.flteTotal,
      "cob_num_cedula_cliente": this.data.cob_num_cedula_cliente || this.data.ven_telefono_cliente,
      "ven_nombre_cliente": this.data.ven_nombre_cliente,
      "ven_telefono_cliente": this.data.ven_telefono_cliente,
      "ciudadDestino": this.data.ciudadDestino,
      "codeCiudad": this.data.codeCiudad,
      "pesoVolumen": 0,
      "ven_barrio": this.data.ven_barrio,
      "ven_direccion_cliente": this.data.ven_direccion_cliente,
      "transportadoraSelect": this.data.transportadoraSelect,
      "fleteManejo": this.data.fleteManejo,
      "flteTotal": this.data.flteTotal,
      "ven_estado": 0,
      "create": this.data.ven_fecha_venta,
      "ven_empresa": this.data.ven_empresa,
      "listaArticulo": this.listCarrito,
      "historySettlementFletes": this.data.historySettlementFletes
    }
    console.log("****306", data )
    this._ventas.create( data ).subscribe( async (res: any) => {
      this.data.usu_clave_int = res.usu_clave_int;
      //this.generarGuia();
      if( this.rolUser != "subAdministrador"){
        this.crearNotificacion({
          titulo: "Nueva venta de " + res.ven_nombre_cliente,
          descripcion: "Nueva venta de " + res.ven_nombre_cliente,
          venta: res.id,
          user: res.usu_clave_int.id,
          admin: 1,
          tipoDe: 0
        });
      }else{
        this.crearNotificacion({
          titulo: "Nueva venta de " + res.ven_nombre_cliente,
          descripcion: "Nueva venta de " + res.ven_nombre_cliente,
          venta: res.id,
          user: res.usu_clave_int.id,
          admin: 2,
          tipoDe: 0
        });
      }
      this.crearNotificacion({
        titulo: " VENTA PENDIENTE " + res.ven_nombre_cliente,
        descripcion: "SIGNIFICA QUE AUN NO HA SIDO DESPACHADO",
        venta: res.id,
        user: res.usu_clave_int.id,
        tipoDe: 0
      });
      this.disabledButton = false;
      this.disabled = false;
      this._tools.tooast({ title: "Hemos Recibido tu Pedido de Manera Exitosa" });

      
      // let url = `https://wa.me/57${ this.proveedorContacto }?text=${encodeURIComponent(` Hola servicio al cliente necesito mas informacion gracias`)}`;
      let url = `https://wa.me/57${ this.proveedorContacto }?text=${encodeURIComponent(`
          Hola bodega (${ this.proveedorNombre } :
          Acabo de enviar una orden de despacho de este producto:  
          ${ this.productoFoto }
          A tu usuario de Lokomproaqui.com agradezco la prioridad de despacho ya que es de gran importancia para satisfacer a nuestro cliente
          Envío de 4 -8 días hábiles
      EN ESPERA DE LA GUÍA DE DESPACHO.
    `)}`;
      window.open( url, "Mas Informacion", "width=640, height=480");
      //this.dialog.closeAll();
      let accion: any = new CartAction({}, 'drop');
      this._store.dispatch(accion);
      this.datas.estado = 3;
      await this.handleUpdate( this.datas );
      this.dialogRef.close('creo');
     });
  }

  handleUpdate( data ){
    return new Promise( resolve =>{
      this._ventas.updateDBI({ id: this.id,  ven_estado: data.estado } ).subscribe( res =>{
        resolve( true );
      },( )=> resolve( false ) );
    });
  }

  crearNotificacion(valuesToSet: any) {
    let data = valuesToSet;
    this._notificacion.create(data).subscribe(() => { }, (error) => this._tools.presentToast("Error de servidor"));
  }

}
