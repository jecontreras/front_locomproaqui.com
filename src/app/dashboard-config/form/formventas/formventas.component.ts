import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { environment } from 'src/environments/environment';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { VentasProductosService } from 'src/app/servicesComponents/ventas-productos.service';
import { CartAction } from 'src/app/redux/app.actions';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { FormcrearguiaComponent } from '../formcrearguia/formcrearguia.component';
import { MediosPagosComponent } from 'src/app/extra/medios-pagos/medios-pagos.component';
import { FormListArticleComponent } from '../form-list-article/form-list-article.component';
import { RechargeService } from 'src/app/servicesComponents/recharge.service';
import { HistorySettlementFletesService } from 'src/app/servicesComponents/history-settlement-fletes.service';

const URL = environment.url;

@Component({
  selector: 'app-formventas',
  templateUrl: './formventas.component.html',
  styleUrls: ['./formventas.component.scss']
})
export class FormventasComponent implements OnInit {

  data: any = {
    ven_tipo: 'whatsapp'
  };
  clone: any = {};
  id: any;
  titulo: string = "Crear";
  files: File[] = [];
  list_files: any = [];
  listProductos: any = [];
  superSub: boolean = false;
  dataUser: any = {};
  disabledButton: boolean = false;
  disabled: boolean = false;
  listTallas: any = [];

  filesGuias: File[] = [];
  mensajeWhat: string;

  disableBtnFile: boolean = false;
  urlImagen: any;
  opcionCurrencys: any = {};

  listCarrito: any = [];
  porcentajeUser: number = 0;
  porcentajeMostrar: number = 0;
  namePorcentaje: string;
  rolUser:string;
  listCiudades:any = DANEGROUP;
  keyword = 'name';
  // url de la publicidad
  url: any;
  textData:string = "";
  dataVendedor:any = {};
  listValorEnvio:any = [];
  tablet:any = {
    header: ["Mensaje","Transp","Origen / Destino","Unid","Total Kilos","Valoración","Flete","Valor Tarifa","Total","Tiempos Aprox"],
    listRow: []
  };
  progreses:boolean = false;
  errorCotisa:string;

  disableSpinner:boolean = true;
  coinShop:boolean = false;
  rolName:string;

  constructor(
    public dialog: MatDialog,
    private _ventas: VentasService,
    private _notificacion: NotificacionesService,
    public _tools: ToolsService,
    private _productos: ProductoService,
    public dialogRef: MatDialogRef<FormventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
    private _tallas: TipoTallasService,
    private _ventasProducto: VentasProductosService,
    private _recharge: RechargeService,
    private _historySettlementFletes: HistorySettlementFletesService
  ) {
    this.opcionCurrencys = this._tools.currency;
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
      if (!this.id) this.listCarrito = _.map( store.cart, ( key:any )=>{
        return {
          colorSelect: key.color,
           ... key
        }
      }) || [];
      if (this.dataUser.usu_perfil.prf_descripcion == 'administrador' ) this.superSub = true;
      else this.superSub = false;
      this.rolName = this.dataUser.usu_perfil.prf_descripcion;
      //this.superSub = false;
      try {
        this.rolUser = this.dataUser.usu_perfil.prf_descripcion;
        if (this.dataUser.categoriaPerfil) {
          this.namePorcentaje = this.dataUser.categoriaPerfil.categoria;
          this.porcentajeUser = this.dataUser.categoriaPerfil.precioPorcentaje;
        }
      } catch (error) {
        this.porcentajeUser = 0;
        this.namePorcentaje = "dropshipping básico";
        this.rolUser = "null";
      }
      if( this.porcentajeUser > this.dataUser.porcentaje ) this.porcentajeMostrar = this.porcentajeUser;
      else this.porcentajeMostrar = this.dataUser.porcentaje;
    });

  }

  async ngOnInit() {
    //console.log( this.dataUser )
    if (Object.keys(this.datas.datos).length > 0) {
      this.clone = _.clone(this.datas.datos);
      this.data = _.clone(this.datas.datos);
      this.datas.datos.ven_estado = this.data.ven_estado;
      this.id = this.data.id;
      this.titulo = "Actualizar";
      this.dataVendedor = this.data.usu_clave_int || {};
      if (this.data.cat_activo === 0) this.data.cat_activo = true;
      if (this.data.pro_clave_int) this.data.pro_clave_int = this.data.pro_clave_int.id;
      if (this.data.ven_tipo == "WHATSAPP") { if (!this.data.ven_imagen_producto) this.data.ven_imagen_producto = "./assets/noimagen.jpg"; this.data.ven_tipo = "whatsapp"; }
      if (this.data.ven_tipo == "CARRITO") { this.data.ven_tipo = "carrito"; }
      if( this.data.ven_imagen_guia ) this.viewRotulo( this.data.ven_imagen_guia );
      await this.getArticulos();
      this.data.ciudadDestino = this.data.ciudadDestino;
      let filtro:any = this.getHistorySettlementFletes();
      //let filtro:any = await this.PrecioContraEntrega();
      filtro = _.find( this.tablet.listRow, ( row:any ) => row.slug === this.clone.transportadoraSelect );
      //console.log("MEN", filtro, this.clone, this.data)
      if( filtro ) if( filtro.slug ) this.selectTrans( filtro, true );
    } else {
      this.id = "";
      this.data.usu_clave_int = this.dataUser.id;
      this.data.ven_usu_creacion = this.dataUser.usu_email;
      this.data.ven_fecha_venta = moment().format('YYYY-MM-DD');
      this.data.cubreEnvio = "tienda";
      this.suma();
      this.data.fleteValor = 0;
    }
    this.progreses = false;
    this.disableSpinner = false;
    //desactivo para que se active cuando se genere la guia
    this.disabledButton = true;
    try {
      //console.log(  this.listCarrito[0].coinShop )
      if( this.listCarrito[0].coinShop == true ){ this.coinShop = this.listCarrito[0].coinShop; this.changeCity();}
    } catch (error) { }
    await this.getCiudades();
    this.listCiudades = this.listCiudades.filter( ( row:any )=> row.code > 0 );
    //this.listValidar();
  }

  getHistorySettlementFletes(){
    return new Promise( resolve =>{
      this._historySettlementFletes.get({ venta: this.id, user: this.dataUser.id, estado: 0 }).subscribe(res=>{
        res = res.data[0];
        if( !res ) return resolve( false);
        this.tablet.listRow = [JSON.parse( res.dataTxt )]
        resolve( true )
      } ,()=> resolve( false ) );
    })
  }

  changeCity(){
    this.data.ciudadDestino = this.listCiudades.find( ( row:any )=> row.name == this.dataUser.usu_ciudad );
    this.data.ven_barrio = this.dataUser.usu_direccion;
    this.data.ven_direccion_cliente = this.dataUser.usu_direccion;
    this.data.cob_num_cedula_cliente = this.dataUser.usu_documento || this.dataUser.usu_telefono;
    this.data.ven_nombre_cliente = this.dataUser.usu_nombre;
    this.data.ven_telefono_cliente = this.dataUser.usu_telefono;
    if( this.data.ciudadDestino ) this.precioRutulo( this.data.ciudadDestino );
    //console.log( "158",this.data,this.listCiudades );
  }

  async listValidar(){
    let result;
    let guardado:any = [];
    for( let item of this.listCiudades ){
      this.data.ciudadDestino = item;
      result = await this.PrecioContraEntrega();
      if( result )guardado.push( item.name );
    }
    //console.log( guardado );
  }

  async getCiudades(){
    return new Promise( resolve => {
      this._ventas.getCiudades( { where: { }, limit: 100000 } ).subscribe( ( res:any )=>{
        this.listCiudades = res.data;
        resolve( this.listCiudades );
      });
    });
  }

  getArticulos() {
    return new Promise( resolve =>{
      this.listCarrito = [];
      this._ventasProducto.get({ where: { ventas: this.id }, limit: 10000 }).subscribe((res: any) => {
        this.listCarrito = _.map(res.data, (item: any) => {
          return {
            foto: item.fotoproducto || item.producto.foto,
            bodegaName: item.producto.pro_usu_creacion.usu_usuario,
            idBodega: item.producto.pro_usu_creacion.id,
            cantidad: item.cantidad,
            tallaSelect: item.tallaSelect,
            costo: item.precio,
            loVendio: item.loVendio,
            id: item.id,
            costoTotal: item.costoTotal,
            colorSelect: item.colorSelect,
            codigoImg: item.codigoImg || "no seleccionado",
            demas: item
          };
        });
        //this.suma();
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); this.listCarrito = [];  resolve( false ); });
    });
  }

  onSelect(event: any) {
    //console.log(event, this.files);
    this.files = [event.addedFiles[0]];
    if( this.id ) if( this.files.length > 0 ) this.subirFile( 'ven_imagen_conversacion' );
  }
  listCiudadesF = [];
  onChangeSearch( val:any ){
    //console.log( val, this.listCiudades )
    if (val) {
      this.listCiudadesF = this.listCiudades.filter((ciudad) =>
        ciudad.city.toLowerCase().includes(val.toLowerCase())
      );
    } else {
      this.listCiudadesF = [];
    }
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  subirFile( opt: string ) {
    this.disabled = true;
    this.disableBtnFile = true;
    this.disabledButton = true;
    let form: any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({ tiempo: 7000, title: "Esperar mientras carga la imagen" });
    this._archivos.create(form).subscribe((res: any) => {
      this.data[opt] = res.files;
      this.disabled = false;
      this.disableBtnFile = false;
      this.disabledButton = false;
      if (this.id) this.submit();
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor al subir una imagen"); this.disableBtnFile = false; this.disabledButton = false; });

  }

  PrecioPush() {
    let idx = _.findIndex(this.listProductos, ['id', Number(this.data.pro_clave_int)])
    if (idx >= 0) {
      this.data.ven_precio = this.listProductos[idx].pro_uni_venta;
      this.productoTallas(this.listProductos[idx]);
    }
  }

  productoTallas(item: any) {
    if (!item.pro_sw_tallas) return false;
    this._tallas.getTalla({ tal_tipo: item.pro_sw_tallas }).subscribe((res: any) => {
      this.listTallas = res.data;
    });
  }

  suma() {
    //console.log( this.data, this.listCarrito, this.namePorcentaje );
    //if( this.superSub == false && this.id ) return false;
    if( this.id ) return this.sumaIds();
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
      if ( this.namePorcentaje == "dropshipping básico" ) row.comision = ( row.costoTotal * ( this.dataUser.porcentaje || 10 ) / 100 );
      else this.data.ven_ganancias+= ( ( row.loVendio  ) - row.costoTotal ) || 0;

    }

    this.data.ven_totalDistribuidor = total;
    this.data.ven_total = total1;
    //console.log( this.dataUser, this.namePorcentaje )
    if ( this.namePorcentaje == "dropshipping básico" ) this.data.ven_ganancias = (total * ( this.dataUser.porcentaje || 10 ) / 100 );
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

  sumaIds() {
    //console.log( this.data, this.listCarrito, this.namePorcentaje );
    //if( this.superSub == false && this.id ) return false;
    let total: number = 0;
    let total1: number = 0;
    this.data.ven_ganancias = 0;
    //console.log( this.listCarrito)
    let namePorcentaje = 0;
    try {
      namePorcentaje = this.data.usu_clave_int.categoriaPerfil;
    } catch (error) {

    }
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

  async submit() {
    this.disabledButton = true; //desactivo boton para evitar doble registro
    //console.log( this.data.ven_tipo == 'pago_anticipado', !this.data.ven_imagen_conversacion, this.data )
    if( this.data.ven_tipo == 'pago_anticipado' && !this.data.ven_imagen_conversacion ) {
      if( this.files.length >0 ) this.subirFile( 'ven_imagen_conversacion' );
      else {
        this._tools.confirm( { title: "Importante", detalle: "Recuerda que debes primero darnos el soporte de pago para despachar el pedido + el valor del envio", icon:"warning" } );
      }
    }
    if( this.data.ven_tipo == 'pago_anticipado' && this.data.fleteValor <= 4000 && this.superSub == true ) {
      let valor:any = await this._tools.alertInput({
        title: "Valor del envio",
        input: "number",
        confirme: "Aceptar"
      });
      //console.log("*******", valor )
      this.data.fleteValor = Number( valor.value );
    }
    if( this.data.ven_tipo == 'pago_anticipado' && this.data.fleteValor <= 4000 && this.superSub == false ) this._tools.confirm( { title: "Importante", detalle: "Recuerda que Falta el valor del envio eso afectara en tu ganancia", icon:"warning" } );
    try {
      if( this.data.ciudadDestino.code ){
        this.data.codeCiudad = this.data.ciudadDestino.code;
        this.data.ciudadDestino = this.data.ciudadDestino.name;
      }
      this.disabled = true;
      this.disabledButton = true;
      if (this.id) {
        //console.log("****", this.superSub, this.clone )
        if (!this.superSub) if ( ( this.clone.ven_estado == 1 || this.clone.ven_estado == 2 || this.clone.ven_estado == 3 || this.clone.ven_estado == 4 ) && this.clone.ven_numero_guia  ) { this._tools.presentToast("Error no puedes ya editar la venta ya esta aprobada"); return false; }
        this.updates();
      }
      else { this.suma(); this.guardar(); }
    } catch (error) {
      return this._tools.presentToast("debes agregar la ciudad del cliente");
    }
  }

  guardar() {

    this.data.ven_estado = 0;
    this.data.create = moment().format('DD-MM-YYYY');
    if (!this.validarPrecio()) { this.disabledButton = false; this.disabled = false; return this._tools.presentToast("el Valorde producto debe contener 5 numeros ejemplo 80000, 90000"); }
    if( ( this.validador() ) == false )  { this.disabledButton = false; this.disabled = false; return false; }
    // if( this.dataUser.cabeza ) if( this.dataUser.cabeza.usu_perfil == 3 ) this.data.ven_subVendedor = 1;
    //console.log( this.dataUser )
    if (this.dataUser.empresa) {
      if (this.dataUser.empresa.id != 1) this.data.ven_subVendedor = 1;
      this.data.ven_empresa = this.dataUser.empresa.id;
    } else this.data.ven_empresa = 1;
    this._ventas.get({ where: { cob_num_cedula_cliente: this.data.cob_num_cedula_cliente, ven_estado: 0, ven_sw_eliminado: 0 } }).subscribe( (res: any) => {
      res = res.data[0];
      if (res) this._tools.basicIcons({ header: "Este cliente tiene una venta activa!", subheader: "Esta venta sera vereficada por posible confuciones" });
      this.guardarVenta();
    });

  }

  validarPrecio() {
    if (10000 > this.data.ven_precio) return false;
    else return true;
  }

  guardarVenta() {
    if ( this.listCarrito.length == 0 ) return this._tools.tooast({ title: "Tiene que existir almenos un articulo seleccionado", icon: "warning" });
    if( !this.data.transportadoraSelect ) return this._tools.tooast({ title: "Tienes que seleccionar por medio de envio lo vas a enviar ( Obligatorio )", icon: "warning" });
    this.data.listaArticulo = this.listCarrito;
    this._ventas.create(this.data).subscribe((res: any) => {
      //this.OrderWhatsapp(res);
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

      //this.dialog.closeAll();
      let accion: any = new CartAction({}, 'drop');
      this._store.dispatch(accion);
      this.id = res.id;
      this.data.id = res.id;
      this.dialogRef.close('creo');
    }, (error) => { this._tools.presentToast("Error al crear la venta"); this.disabledButton = false; this.dialog.closeAll(); });

  }

  validador(){
    if( !this.data.cob_num_cedula_cliente ) { this._tools.tooast( { title: "Error falta la cedula del cliente", icon: "error" } ); return false; }
    if( !this.data.ven_nombre_cliente ) { this._tools.tooast( { title: "Error falta el nombre del cliente", icon: "error" } ); return false; }
    if( !this.data.ven_telefono_cliente ) { this._tools.tooast( { title: "Error falta el numero de celular del cliente", icon: "error" } ); return false; }
    if( !this.data.ciudadDestino ) { this._tools.tooast( { title: "Error falta la ciudad de destino del cliente", icon: "error" } ); return false; }
    if( !this.data.ven_barrio ) { this._tools.tooast( { title: "Error falta el barrio de destino del cliente", icon: "error" } ); return false; }
    if( !this.data.ven_direccion_cliente ) { this._tools.tooast( { title: "Error falta la direccion del cliente", icon: "error" } ); return false; }
    if( !this.data.cubreEnvio ) { this._tools.tooast( { title: "Error falta Quien Paga el Envio", icon: "error" } ); return false; }

    return true;
  }

  OrderWhatsapp(res: any) {
    let cerialNumero: any = '';
    let cabeza: any = this.dataUser.cabeza || {};
    let numeroSplit = _.split(cabeza.usu_telefono, "+57", 2);
    if (numeroSplit[1]) cabeza.usu_telefono = numeroSplit[1];
    if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || '3506700802');
    else cerialNumero = "573506700802";
    let dataCarro: string = "";
    for (let row of this.listCarrito) {
      dataCarro += `Foto de el producto: ${row.foto}
        cantidad: ${row.cantidad}
        talla: ${row.tallaSelect}
        valor a cobrar: ${(row.costoTotal || 0).toLocaleString(1)}
        `;
    }
    let mensaje: string = ``;
    mensaje = `https://wa.me/${cerialNumero}&text=${encodeURIComponent(`
      Hola Servicio al cliente, como esta, saludo cordial,
      estos son los datos de la venta realizada por ${this.dataUser.usu_nombre}

      Nombre de cliente: ${res.ven_nombre_cliente}
      N'Cedula de cliente: ${res.cob_num_cedula_cliente}
      *celular:*${res.ven_telefono_cliente}
      Ciudad: ${res.ven_ciudad}
      ${res.ven_barrio}
      Dirección: ${res.ven_direccion_cliente}
      ${dataCarro}

      TOTAL FACTURA ${(this.data.ven_total || 0).toLocaleString(1)}
      🤝Gracias por su atención y quedo pendiente para recibir por este medio la imagen de la guía de despacho`)}`;
    //console.log(mensaje);
    window.open(mensaje);
  }

  OrdenValidadWhatsapp(res: any) {
    let cerialNumero: any = `${res.usu_clave_int.usu_indicativo}${res.usu_clave_int.usu_telefono}`;
    this.mensajeWhat = `info del cliente ${res.ven_nombre_cliente} telefono ${res.ven_telefono_cliente || ''} fecha del pedido ${res.ven_fecha_venta} Hola Vendedor,
    como esta, cordial saludo. su pedido ya fue despachado numero guia ${res.ven_numero_guia} Foto de guia ${res.ven_imagen_guia}`;
    let mensaje: string = `https://wa.me/${cerialNumero}?text=${this.mensajeWhat}`;
    // console.log( mensaje , res);
    window.open(mensaje);
    this.copiarLink();
    // cerialNumero = `57${ res.ven_telefono_cliente }`;
    // mensaje = `https://wa.me/${ cerialNumero }?text=info del cliente ${res.ven_nombre_cliente} telefono ${res.ven_telefono_cliente || ''} fecha del pedido ${res.ven_fecha_venta} Hola Vendedor,
    // como esta, cordial saludo. su pedido ya fue despachado numero guia ${ res.ven_numero_guia } Foto de guia ${ res.ven_imagen_guia }`;
    // window.open(mensaje);
  }

  copiarLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.mensajeWhat;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.openSnack('Copiado:' + ' ' + this.mensajeWhat, 'completado', false);
  }

  updates( opt:boolean = false ) {
    if( !opt ) if (!this.superSub) if ( ( this.clone.ven_estado == 1 || this.clone.ven_estado == 2 || this.clone.ven_estado == 3 || this.clone.ven_estado == 4 ) || ( this.clone.ven_numero_guia ) ) { this._tools.presentToast("Error no puedes ya editar la venta ya esta aprobada"); return false; }
    console.log("************DATA", this.data )
    try {
      if( this.data.ciudadDestino.code ){
        this.data.codeCiudad = this.data.ciudadDestino.code;
        this.data.ciudadDestino = this.data.ciudadDestino.name;
      }
    } catch (error) { }
    let data = _.clone( this.data );
    /*data = _.omit( data, ['usu_clave_int']);
    if( this.superSub == false ) {
      data = _.omit( data, ['usu_clave_int']);
    } */
    try {
      data.usu_clave_int = data.usu_clave_int.id || data.usu_clave_int;
    } catch (error) { data.usu_clave_int = data.usu_clave_int; }
    data = _.omitBy(data, _.isNull);
    this._ventas.update( data ).subscribe((res: any) => {
      this._tools.presentToast("Actualizado");
      this.disabledButton = false;
      this.disabled = false;
      this.clone.ven_numero_guia = this.data.ven_numero_guia;
      if (this.clone.ven_estado != this.data.ven_estado) {
        let armando = {
          titulo: "VENTA DESPACHADO " + res.ven_nombre_cliente,
          descripcion: "SIGNIFICA QUE YA TU PAQUETE ESTA EN CAMINO",
          venta: res.id,
          user: res.usu_clave_int,
          tipoDe: 0
        };
        if (this.data.ven_estado == 2) {
          armando.titulo = `VENTA RECHAZADA ${res.ven_nombre_cliente}`;
          armando.descripcion = `SIGNIFICA QUE TU VENTA FUE RECHAZADA POR EL ADMINISTRADOR POR FAVOR COMUNICARTE CON SOPORTE`;
        }
        this.crearNotificacion(armando);
      }
      //if( res.ven_estado == 3 ) this.OrdenValidadWhatsapp( res );
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); this.disabledButton = false; this.disabled = false; });
  }

  crearNotificacion(valuesToSet: any) {
    let data = valuesToSet;
    this._notificacion.create(data).subscribe(() => { }, (error) => this._tools.presentToast("Error de servidor"));
  }

  onSelectGuias(event: any) {
    //console.log(event, this.files);
    this.filesGuias = [event.addedFiles[0]]
  }

  onRemoveGuias(event) {
    //console.log(event);
    this.filesGuias.splice(this.filesGuias.indexOf(event), 1);
  }

  subirFileGuias() {
    this.disabled = true;
    let form: any = new FormData();
    form.append('file', this.filesGuias[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res: any) => {
      this.data.ven_imagen_guia = res.files;
      //this._tools.presentToast("Exitoso");
      this.disabled = false;
      this.submit();
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor al subir una imagen") });

  }

  generarGuia(){
    console.log("***", this.data)
    this.data.articulo = this.listCarrito;
    const dialogRef = this.dialog.open( FormcrearguiaComponent,{
      data: { datos: this.data || {} }
    } );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if( !result ) return false;
      if( !result.id ) return false;
      this.data.ven_numero_guia = result.nRemesa;
      this.data.ven_imagen_guia = result.urlRotulos;
      if( this.data.transportadoraSelect === "CORDINADORA") this.imprimirGuia();
      if( this.data.transportadoraSelect === "ENVIA") this.viewRotulo( result.urlRotulos );
      if( this.data.transportadoraSelect === "TCC") this.imprimirGuia();
      this.data.ven_estado = 6;
      this.updates();
      this.disabledButton = false;
    });
  }

  async cancelarGuia(){
    let validador = await this._tools.confirm( { title: "Desas Cancelar la guia", icon: "succes" } );
    if( !validador.value ) return false;
    this.disabledButton = true;
    this._ventas.cancelarFlete( {
      nRemesa: this.data.ven_numero_guia,
      transportadoraSelect: this.data.transportadoraSelect
    } ).subscribe(( res:any )=>{
      this.disabledButton = false;
      if( res.status !== 200 ) return this._tools.presentToast( "Error en cancelar guia" );

      this.data.ven_numero_guia = "";
      this.data.ven_imagen_guia = "";
      if( this.id ) this.updates( true );
    },( error:any  )=> { this.disabledButton = false; this._tools.presentToast( "Error en cancelar guia" );} );
  }

  viewRotulo( urlRotulos ){
    this.url = this._tools.seguridadIfrane( urlRotulos );
    window.open( urlRotulos );
  }

  imprimirGuia(){
    if( this.data.transportadoraSelect == "ENVIA" || this.data.transportadoraSelect == "TCC") {
      if( this.data.ven_imagen_guia ) window.open( this.data.ven_imagen_guia );
      else{
        this._ventas.getFletes( {  where: {  nRemesa: this.data.ven_numero_guia } } ).subscribe( ( res:any ) =>{
          res = res.data[0];
          if( !res ) return this._tools.tooast("Error al imprimir la guia por favor comunicarse con el servicio al cliente")
          window.open( res.urlRotulos );
        });
      }
    }
    if( this.data.transportadoraSelect == "CORDINADORA" || this.data.transportadoraSelect == "INTERRAPIDISIMO" || this.data.transportadoraSelect == "SERVIENTREGA" ){
      this._ventas.imprimirFlete( {
        codigo_remision: this.data.ven_numero_guia,
        transportadoraSelect: this.data.transportadoraSelect
      }).subscribe(( res:any ) =>{
        this._tools.downloadPdf( res.data, this.data.ven_numero_guia );
      })
    }
  }

  verDetalles( url:string ){
    window.open( "https://enviosrrapidoscom.web.app/portada/guiadetalles/" + url )
  }

  openEvidencia( url:string ){
    window.open( url )
  }

  async precioRutulo( ev:any ){
    console.log( ev, this.data );
    if( this.superSub == false && this.data.ven_numero_guia ) return this._tools.confirm( { title: "Lo sentimos tienes una guia generada ya", detalle: "1.Toca cancelar la guia si te quedo mal. 2.hablar con el servicio al cliente", icon: "error" } );
    /*if( this.disabledButton ) return false;
    this.disabledButton = true;*/
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
    //console.log( result, this.data )
    this.progreses = false;
    this.disableSpinner = false;
    this.disabledButton = false;
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
      if( this.listCarrito[0] ) data.userStore= this.listCarrito[0].idBodega,

      this._ventas.getFleteValor( data ).subscribe(( res:any )=>{
        this.tablet.listRow = res.data || [];
        this.tablet.listRow = _.filter( this.tablet.listRow, ( item:any )=> item.fleteTotal > 0 );
        //console.log( "****", res, this.tablet)
        if( this.tablet.listRow.length === 0 ) this.errorCotisa = "Siento que la bodega no tenga transportador activo, comuníquese con el servicio al cliente."
        try {
          this.selectTrans( res.data[2] );
        } catch (error) {}
        resolve( true );
      },()=>resolve( false ));
    });
  }

  validateCoin(){
   return new Promise( resolve =>{
    this._recharge.getValidateRecharge({
      user: this.dataUser.id
     }).subscribe( res=>{
      resolve( res.data );
     },()=> resolve( 0 ) );
   })
  }

  async selectTrans( item, opt = false ){
    if( !item ) return false;
    if( this.rolName === 'vendedor') if( this.data.ven_estado === 0 ) if( item.fleteTotal >= await this.validateCoin() ) return this._tools.error( { mensaje: "¡Necesitas recargar tu cuenta para poder crear guias... 1.entra a recargar Saldo y compra tu paquete!", footer: `<a target="_blank" href="${ window.location.origin }/config/recharge ">Recargar Paquete</a>`} );
    if( this.data.ven_numero_guia && !opt) return false;
    this.data.transportadoraSelect = item.slug;
    if( this.data.transportadoraSelect === "CORDINADORA" || this.data.transportadoraSelect === "ENVIA" || this.data.transportadoraSelect === "INTERRAPIDISIMO" || this.data.transportadoraSelect === "TCC") {
      this.data.ven_tipo = "contraEntrega";
    }else this.data.ven_tipo = "envioNormal";
    for(let row of this.tablet.listRow ) row.check = false;
    item.check = !item.check;
    this.data.fleteValor = item.fleteTotal;
    this.data.fleteManejo = item.fleteManejo;
    this.data.flteTotal = item.fleteTotal;
    this.data.historySettlementFletes = JSON.stringify( item );
    this.suma();
  }

  borrarCart( data:any ){
    if( this.data.id ) return false;
    //console.log( data )
    this.listCarrito = this.listCarrito.filter( ( row:any )=> row.id !== data.id );
    this.suma();
    let accion = new CartAction( data, 'delete' );
    this._store.dispatch( accion );
  }

  openMedios(){
    const dialogRef = this.dialog.open( MediosPagosComponent,{
      data: { datos: this.data || {} }
    } );

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  handleOpenArticle(){
    const dialogRef = this.dialog.open(FormListArticleComponent,{
      data: {
        view: "formVenta"
      }
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      console.log(`Dialog result: ${result}`);
      this.suma();
    });
  }



}
