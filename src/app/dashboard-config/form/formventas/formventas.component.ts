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
  constructor(
    public dialog: MatDialog,
    private _ventas: VentasService,
    private _notificacion: NotificacionesService,
    private _tools: ToolsService,
    private _productos: ProductoService,
    public dialogRef: MatDialogRef<FormventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
    private _tallas: TipoTallasService,
    private _ventasProducto: VentasProductosService
  ) {
    this.opcionCurrencys = this._tools.currency;
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
      if (!this.id) this.listCarrito = store.cart || [];
      if (this.dataUser.usu_perfil.prf_descripcion == 'administrador' || this.dataUser.usu_perfil.prf_descripcion == 'subAdministrador') this.superSub = true;
      else this.superSub = false;
      try {
        if (this.dataUser.categoriaPerfil) this.porcentajeUser = this.dataUser.categoriaPerfil.precioPorcentaje;
      } catch (error) {
        this.porcentajeUser = 0;
      }
      if( this.porcentajeUser > this.dataUser.porcentaje ) this.porcentajeMostrar = this.porcentajeUser;
      else this.porcentajeMostrar = this.dataUser.porcentaje;
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
      if (this.data.ven_tipo == "WHATSAPP") { if (!this.data.ven_imagen_producto) this.data.ven_imagen_producto = "./assets/noimagen.jpg"; this.data.ven_tipo = "whatsapp"; }
      if (this.data.ven_tipo == "CARRITO") { this.data.ven_tipo = "carrito"; }
      this.getArticulos();
    } else {
      this.id = "";
      this.data.usu_clave_int = this.dataUser.id;
      this.data.ven_usu_creacion = this.dataUser.usu_email;
      this.data.ven_fecha_venta = moment().format('YYYY-MM-DD');
    }
    this.suma();
  }

  getArticulos() {
    this._ventasProducto.get({ where: { ventas: this.id }, limit: 10000 }).subscribe((res: any) => {
      this.listCarrito = _.map(res.data, (item: any) => {
        return {
          foto: item.producto.foto,
          cantidad: item.cantidad,
          tallaSelect: item.tallaSelect,
          costo: item.precio,
          loVendio: item.loVendio,
          id: item.id,
          demas: item
        };
      });
      this.suma();
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); this.listCarrito = []; });
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
    this._tools.ProcessTime({ tiempo: 7000, title: "Esperar mientras carga la imagen" });
    this._archivos.create(form).subscribe((res: any) => {
      this.data.ven_imagen_producto = res.files;
      this.disabled = false;
      this.disableBtnFile = false;
      this.disabledButton = false;
      if (this.id) this.submit();
      else {
        if (opt) if ((this.data.ven_tipo == 'whatsapp' || this.data.ven_tipo == 'WHATSAPP') && this.data.ven_imagen_producto) this.submit();
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
    // console.log( this.data );
    let total: number = 0;
    this.data.ven_ganancias = 0;
    for (let row of this.listCarrito) {
      if (!row.costo || !row.cantidad) continue;
      total += (Number(row.costo) * Number(row.cantidad));
      if ( this.porcentajeUser == 0 ) row.comision = (row.costo * (this.dataUser.porcentaje || 10) / 100);
      else this.data.ven_ganancias+= ( row.loVendio - row.costoTotal ) || 0;
    }
    this.data.ven_total = total;
    if ( this.porcentajeUser == 0 ) this.data.ven_ganancias = (total * ( this.dataUser.porcentaje || 10 ) / 100 );
    console.log( this.porcentajeUser )
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
    if (!this.validarPrecio()) { this.disabledButton = false; this.disabled = false; return this._tools.presentToast("el Valorde producto debe contener 5 numeros ejemplo 80000, 90000"); }
    // if( this.dataUser.cabeza ) if( this.dataUser.cabeza.usu_perfil == 3 ) this.data.ven_subVendedor = 1;
    if (this.dataUser.empresa) {
      if (this.dataUser.empresa.id != 1) this.data.ven_subVendedor = 1;
      this.data.empresa = this.dataUser.empresa.id;
    } else this.data.empresa = 1;
    this._ventas.get({ where: { cob_num_cedula_cliente: this.data.cob_num_cedula_cliente, ven_estado: 0, ven_sw_eliminado: 0 } }).subscribe((res: any) => {
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
    if (this.listCarrito.length == 0) return this._tools.tooast({ title: "Tiene que existir almenos un articulo seleccionado", icon: "warning" });
    this.data.listaArticulo = this.listCarrito;
    this._ventas.create(this.data).subscribe((res: any) => {
      //this.OrderWhatsapp(res);
      this.crearNotificacion({
        titulo: "Nueva venta de " + res.ven_nombre_cliente,
        descripcion: "Nueva venta de " + res.ven_nombre_cliente,
        venta: res.id,
        user: res.usu_clave_int.id,
        admin: 1,
        tipoDe: 0
      });
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
      this.dialogRef.close('creo');
    }, (error) => { this._tools.presentToast("Error al crear la venta"); this.disabledButton = false; this.dialog.closeAll(); });

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
    console.log(mensaje);
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

  updates() {
    this.data = _.omit(this.data, ['usu_clave_int']);
    this.data = _.omitBy(this.data, _.isNull);
    this._ventas.update(this.data).subscribe((res: any) => {
      this._tools.presentToast("Actualizado");
      this.disabledButton = false;
      this.disabled = false;
      if (this.clone.ven_estado != this.data.ven_estado) {
        let armando = {
          titulo: "VENTA DESPACHADO " + res.ven_nombre_cliente,
          descripcion: "SIGNIFICA QUE YA TU PAQUETE ESTA EN CAMINO",
          venta: res.id,
          user: res.usu_clave_int.id,
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



}