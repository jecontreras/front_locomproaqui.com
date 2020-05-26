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

  filesGuias:File[] = [];
  mensajeWhat:string;

  disableBtnFile:boolean = false;
  urlImagen:any;

  constructor(
    public dialog: MatDialog,
    private _ventas: VentasService,
    private _notificacion: NotificacionesService,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private _model: ServiciosService,
    public dialogRef: MatDialogRef<FormventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
    private _tallas: TipoTallasService
  ) {

    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if (this.dataUser.usu_perfil.prf_descripcion == 'administrador' || this.dataUser.usu_perfil.prf_descripcion == 'subAdministrador') this.superSub = true;
      else this.superSub = false;
    });

  }

  ngOnInit() {
    if (Object.keys(this.datas.datos).length > 0) {
      this.clone = _.clone(this.datas.datos);
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if (this.data.cat_activo === 0) this.data.cat_activo = true;
      if (this.data.pro_clave_int) this.data.pro_clave_int = this.data.pro_clave_int.id;
      if ( this.data.ven_tipo == "WHATSAPP" ) { if( !this.data.ven_imagen_producto ) this.data.ven_imagen_producto = "./assets/noimagen.jpg"; this.data.ven_tipo = "whatsapp"; }
      if ( this.data.ven_tipo == "CARRITO" ) { this.data.ven_tipo = "carrito"; }
    } else {
      this.id = "";
      this.data.usu_clave_int = this.dataUser.id;
      this.data.ven_usu_creacion = this.dataUser.usu_email;
      this.data.ven_fecha_venta = moment().format('YYYY-MM-DD');
    }
    this.getArticulos();
    console.log(this.data)
  }

  getArticulos() {
    this._productos.get({ where: { pro_activo: 0 }, limit: 10000 }).subscribe((res: any) => {
      this.listProductos = res.data;
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor") });
  }

  onSelect(event: any) {
    //console.log(event, this.files);
    this.files = [event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  // async subirFile(opt: boolean) {
  //   this.disabled = true;
  //   this.disableBtnFile = true;
  //   this.disabledButton = true;
  //   let form: any = new FormData();
  //   form.append('file', this.files[0]);
  //   this._tools.ProcessTime({});
  //   this.urlImagen = await this._archivos.getBase64(this.files[0]);
  //   this.disabled = false;
  //   this.disableBtnFile = false;
  //   this.disabledButton = false;
  //   if (this.id) this.submit();
  //   else {
  //     if (opt) if ( ( this.data.ven_tipo == 'whatsapp' || this.data.ven_tipo == 'WHATSAPP' ) && this.urlImagen) this.submit();
  //   }

  // }

  subirFile(opt: boolean) {
    this.disabled = true;
    this.disableBtnFile = true;
    this.disabledButton = true;
    let form: any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res: any) => {
      this.data.ven_imagen_producto = res.files;
      this.disabled = false;
      this.disableBtnFile = false;
      this.disabledButton = false;
      if (this.id) this.submit();
      else {
        if (opt) if ( ( this.data.ven_tipo == 'whatsapp' || this.data.ven_tipo == 'WHATSAPP' ) && this.data.ven_imagen_producto) this.submit();
      }
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
    if (!this.data.ven_precio || !this.data.ven_cantidad) return false;
    this.data.ven_total = (Number(this.data.ven_precio) * Number(this.data.ven_cantidad));
    this.data.ven_ganancias = (this.data.ven_total * (this.dataUser.porcentaje || 7.777) / 100);
  }

  submit() {
    this.disabled = true;
    this.suma();
    this.disabledButton = true;
    if (this.id) {
      if (!this.superSub) if (this.clone.ven_estado == 1) { this._tools.presentToast("Error no puedes ya editar la venta ya esta aprobada"); return false; }
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar() {

    this.data.ven_estado = 0;
    this.data.create = moment().format('DD-MM-YYYY'); 
    if( !this.validarPrecio() ) { this.disabledButton = false; this.disabled = false; return this._tools.presentToast("el Valorde producto debe contener 5 numeros ejemplo 80000, 90000"); }
    // if( this.dataUser.cabeza ) if( this.dataUser.cabeza.usu_perfil == 3 ) this.data.ven_subVendedor = 1;
    if( this.dataUser.empresa ) if( this.dataUser.empresa.id != 1 ) this.data.ven_subVendedor = 1;
    this._ventas.get({ where: { cob_num_cedula_cliente: this.data.cob_num_cedula_cliente, ven_estado: 0, ven_sw_eliminado: 1 } }).subscribe((res: any) => {
      res = res.data[0];
      if (res) this._tools.basicIcons({ header: "Este cliente tiene una venta activa!", subheader: "Esta venta sera vereficada por posible confuciones" });
      this.guardarVenta();
    });

  }

  validarPrecio(){
    if( 10000 > this.data.ven_precio) return false;
    else return true;
  }

  guardarVenta() {
    this._ventas.create(this.data).subscribe((res: any) => {
      this.OrderWhatsapp(res);
      this.crearNotificacion(res);
      this.disabledButton = false;
      this.disabled = false;
      this._tools.presentToast("Exitoso Estare en Modo Pendiente");
      this.dialog.closeAll();
    }, (error) => { this._tools.presentToast("Error al crear la venta"); this.disabledButton = false; this.dialog.closeAll(); });

  }

  OrderWhatsapp( res:any ) {
    let cerialNumero:any = ''; 
    let cabeza:any = this.dataUser.cabeza || {};
    let numeroSplit = _.split( cabeza.usu_telefono, "+57", 2);
    if( numeroSplit[1] ) cabeza.usu_telefono = numeroSplit[1];
    if( cabeza.usu_perfil == 3 ) cerialNumero = ( cabeza.usu_indicativo || '57' ) + ( cabeza.usu_telefono || '3148487506' );
    else cerialNumero = "573148487506";
    let mensaje: string = `https://wa.me/${ cerialNumero }?text=info del cliente ${res.ven_nombre_cliente} telefono ${res.ven_telefono_cliente || ''} direccion ${res.ven_direccion_cliente} fecha del pedido ${res.ven_fecha_venta} Hola Servicio al cliente, 
    como esta, cordial saludo. Sería tan amable despachar este pedido a continuación datos de la venta:� producto: `;
    if (res.ven_tipo == 'whatsapp') {
      mensaje += `${ ( res.nombreProducto ) } imagen: ${res.ven_imagen_producto} talla: ${res.ven_tallas}`
    } else {
      mensaje += `${res.pro_clave_int.pro_nombre} imagen: ${res.pro_clave_int.foto} codigo: ${res.pro_clave_int.pro_codigo} talla: ${res.ven_tallas} `
    }
    window.open(mensaje);
  }

  OrdenValidadWhatsapp( res:any ){
    let cerialNumero:any = `${ res.usu_clave_int.usu_indicativo }${ res.usu_clave_int.usu_telefono }`; 
    this.mensajeWhat = `info del cliente ${res.ven_nombre_cliente} telefono ${res.ven_telefono_cliente || ''} fecha del pedido ${res.ven_fecha_venta} Hola Vendedor, 
    como esta, cordial saludo. su pedido ya fue despachado numero guia ${ res.ven_numero_guia } Foto de guia ${ res.ven_imagen_guia }`;
    let mensaje: string = `https://wa.me/${ cerialNumero }?text=${ this.mensajeWhat }`;
    // console.log( mensaje , res);
    window.open(mensaje);
    this.copiarLink();
    // cerialNumero = `57${ res.ven_telefono_cliente }`; 
    // mensaje = `https://wa.me/${ cerialNumero }?text=info del cliente ${res.ven_nombre_cliente} telefono ${res.ven_telefono_cliente || ''} fecha del pedido ${res.ven_fecha_venta} Hola Vendedor, 
    // como esta, cordial saludo. su pedido ya fue despachado numero guia ${ res.ven_numero_guia } Foto de guia ${ res.ven_imagen_guia }`;
    // window.open(mensaje);
  }

  copiarLink(){
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

  updates() {
    this.data = _.omit(this.data, ['usu_clave_int']);
    this.data = _.omitBy( this.data, _.isNull);
    this._ventas.update(this.data).subscribe((res: any) => {
      this._tools.presentToast("Actualizado");
      this.disabledButton = false;
      this.disabled = false;
      //if( res.ven_estado == 3 ) this.OrdenValidadWhatsapp( res );
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); this.disabledButton = false; this.disabled = false; });
  }

  crearNotificacion(valuesToSet: any) {
    let data = {
      titulo: "Nueva venta de " + valuesToSet.ven_nombre_cliente,
      descripcion: "Nueva venta de " + valuesToSet.ven_nombre_cliente,
      venta: valuesToSet.id,
      user: valuesToSet.usu_clave_int.id,
      tipoDe: 0
    };
    this._notificacion.create(data).subscribe(() => {}, (error) => this._tools.presentToast("Error de servidor"));
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



}