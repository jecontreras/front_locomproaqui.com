import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';
import { Indicativo } from 'src/app/JSON/indicativo';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { departamento } from 'src/app/JSON/departamentos';
import { FormproductosComponent } from '../../form/formproductos/formproductos.component';
import { MatDialog } from '@angular/material';
const URL = environment.url;
const URLFRON = window.location.origin;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { OpenIframeComponent } from 'src/app/extra/open-iframe/open-iframe.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  data: any = {
    usu_indicativo: "57"
  };
  files: File[] = [];
  list_files: any = [];
  urlTienda: string = `${URLFRON}/front/index/`;
  urlRegistro: string = `${URLFRON}/singUp/vendedor/`;
  restaure: any = {};
  disableRestaure: boolean = false;
  listIndicativos = Indicativo;
  disableBtn: boolean = false;
  fecha: string = moment().format("DD/MM/YYYY");
  imageChangedEvent: any = '';
  croppedImage: any = '';
  textPerfil: string = "";
  listCategorias: any = [];
  listCiudad: any = [];
  listDepartamento: any = departamento;
  dataSolicitud: any = {};
  // disable validaro email
  disabledemail: boolean = true;
  // disable validador username
  disabledusername: boolean = true;
  listCiudades:any = DANEGROUP;
  keyword = 'name';

  fieldTextType: boolean;
  viewOpt:string;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
    private _categorias: CategoriasService,
    public dialog: MatDialog,
    private _ventas: VentasService
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.data = store.user;
      this.data.usu_nombre1 = (this.data.usu_nombre || "") + " " + (this.data.usu_apellido || "");
      if (this.data.usu_perfil.prf_descripcion != 'subAdministrador' || this.data.usu_perfil.prf_descripcion != 'administrador' || this.data.usu_perfil.prf_descripcion != 'lider') this.disableBtn = true;
      this.textPerfil = this.data.usu_perfil.prf_descripcion;
    });
  }

  ngOnInit() {
    console.log(this.data.usu_nombre1)
    this.getCiudades();
    //this.data = this._model.dataUser || {};
    if (this.data.usu_fec_nacimiento) this.data.usu_fec_nacimiento = moment(this.data.usu_fec_nacimiento).format('DD/MM/YYYY');
    this.urlTienda += this.data.usu_telefono;
    this.urlRegistro += this.data.usu_telefono;
    this.getCategorias();
    for (let row of this.listDepartamento) for (let item of row.ciudades) this.listCiudad.push({ departamento: row.departamento, ciudad: item });
    this.listCiudad = _.orderBy( this.listCiudad, ['ciudad'], ['asc']);
  }

  validadEmail() {
    this.disabledemail = true;
    if (this.data.usu_email) {
      const
        filtro: any = this.data.usu_email.split('@', '2')
        ;
      console.log(filtro);
      //if ( filtro[1] == 'gmail.com' || filtro[1] == 'gmail.es'|| filtro[1] == 'hotmail.com'|| filtro[1] == 'outlook.com'|| filtro[1] == 'outlook.es') {
      if (filtro[1] == 'gmail.com' || filtro[1] == 'gmail.es') {
        this.disabledemail = true;
      } else this.disabledemail = false;
    }
  }

  validadUsername() {

    this.disabledusername = true;
    if (this.data.usu_usuario) {
      // console.log(this.data.usu_usuario.replace(/ /g, ""));
      this.data.usu_usuario = this.data.usu_usuario.replace(/ /g, '');
      this.data.usu_usuario = this.data.usu_usuario.replace(/[^a-zA-Z ]/g, "");
      this.data.usu_usuario = _.camelCase(this.data.usu_usuario);
      this._user.get({ where: { usu_usuario: this.data.usu_usuario, id: { '!=': [this.data.id] } } })
        .subscribe(
          (res: any) => {
            res = res.data[0];
            // console.log(res);
            if (res) this.disabledusername = false;
          }
        )
        ;
    }
  }

  async getCiudades(){
    return new Promise( resolve => {
      this._ventas.getCiudades( { where: { }, limit: 100000 } ).subscribe( ( res:any )=>{
        this.listCiudades = res.data;
      });
    });
  }

  getCategorias() {
    this._categorias.getAll({ where: { cat_activo: 0, cat_padre: null }, limit: 1000 }).subscribe(async (res: any) => {
      this.listCategorias = res.data;
      let userC:any = await this.getUserCategory();
      for( let row of this.listCategorias ){
        let filtro = userC.find( item => item.cat_categoria === row.id );
        if( filtro ) row.check = true;
      }
    }, () => this._tools.tooast("Error de servidor"));
  }

  getUserCategory(){
    return new Promise( resolve =>{
      this._categorias.getUser( { where:{ cat_usu: this.data.id, cat_activo:0 }, limit: 10000 } ).subscribe( res => {
        resolve( res.data || [] );
      });
    })
  }

  openView( opt:string ){
    console.log("***143", opt)
    this.viewOpt = opt;
  }

  finixCorteImg( opt:string ){
    //Usage example:
    var file = this._tools.converBase64ImgToBynare(this.croppedImage,'hello');
    //console.log(file);
    this.files.push( file );
    this.subirFile(opt);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent)
  }
  openFile( urlText ){
    const dialogRef = this.dialog.open(OpenIframeComponent,{
      data: {
        url: urlText
      },
      // height:  '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  async fileChangeEventPDF( event:any, opt:string ){
    let file = event.target.files[0];
    let base = await this._tools.getBase64( file );
    this._archivos.createFile( {
      fileBase64: base
    } ).subscribe( res =>{
      this.data[opt] = res.url;
      this.Actualizar();
    });
    //var file = this._tools.converBase64ImgToBynare(this.croppedImage,'hello');
    /*this.files = [];
    this.files.push( file );
    this.subirFileTotal(opt);*/
  }
  imageCropped(event: any) {
    this.croppedImage = event.base64;
    console.log(event);
    //this.subirFile('usu_imagen');
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
    console.log(image)
  }
  cropperReady(event: any) {
    // cropper ready
    console.log(event)
  }
  loadImageFailed(event: any) {
    // show message
    console.log(event)
  }

  onSelect(event: any) {
    //console.log(event, this.files);
    this.files = [event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  subirFileTotal(opt: string) {
    let form: any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.createFile(form).subscribe(async (res: any) => {
      console.log(res);
      this.data[opt] = res.files; //URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      await this.Actualizar();
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor") });
  }

  subirFile(opt: string) {
    let form: any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe(async (res: any) => {
      console.log(res);
      this.data[opt] = res.files; //URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      await this.Actualizar();
      this.files = [];
      this.imageChangedEvent = "";
      this.viewOpt = "";
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor") });

  }

  CambiarPassword() {
    this._user.cambioPass({ id: this.data.id, password: this.restaure.passNew })
      .subscribe((res: any) => { this.disableRestaure = false; this.restaure = {}; this._tools.presentToast("Actualizado Password"); },
        (error) => { console.error(error); this._tools.presentToast("Error Servidor"); });
  }

  Actualizar() {
    return new Promise( resolve =>{
      if (!this.disabledusername || !this.disabledemail) return this._tools.tooast({ title: "Error tenemos problemas en el formulario por favor revisar gracias", icon: "error" })

      this.data = _.omit(this.data, ['usu_perfil', 'cabeza', 'nivel', 'empresa', 'createdAt', 'updatedAt', 'categoriaPerfil']); this.data = _.omitBy(this.data, _.isNull);
      try { this.data.usu_ciudad = this.data.usu_ciudad.name; } catch (error) { error }
      this._user.update(this.data).subscribe((res: any) => {
        //console.log(res);
        this._tools.presentToast("Actualizado");
        let accion = new UserAction(res, 'put');
        this._store.dispatch(accion);
        this.handleCategorySelect();
        this.updatePlatform();
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de Servidor"); resolve( false ); })
    })
  }

  updatePlatform(){
    this._user.updatePlatform(
      {
        usu_telefono: this.data.usu_telefono,
        usu_ciudad: this.data.usu_ciudad,
        usu_email: this.data.usu_email,
        direccion: this.data.direccion
      }
    ).subscribe( res => res );
  }

  abrrirTienda() {
    window.open(this.urlTienda);
  }

  copiarLink() {
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

  copiarLinkRegistro() {
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

  colorDato() {
    console.log(this.data);
  }

  handleCategorySelect() {
    let dataEnd = [];
    for( let row of this.listCategorias ){
      if( row.check === true ){
        dataEnd.push( {
          cat_categoria: row.id,
          check: true,
          cat_usu: this.data.id
        } );
      }
    }
    if( dataEnd.length === 0 ) return false;
    this._categorias.createUser( {listCategory: dataEnd } ).subscribe( res =>{
      this._tools.presentToast("Actualizado...");
    });
  }

  async iniciarClick() {
    let respuesta = await this._tools.confirm({
      title: "SUBIR 5 IMÁGENES DE TUS MEJORES PRODUCTOS –PRECIO PARA DISTRIBUIDOR",
      detalle: `Ten en Cuenta, que si los Precios que Quieres Mostrar a Nuestra Enorme Comunidad de Distribuidores es Atractivo.
      Ellos se Motivarán a Pagar Marketing y Publicidad para Promocionar tus Productos en las Plataformas más Grandes,
      Tendrás más Posibilidades de un Mayor Número de Ventas PRECIO SUGERIDO DE VENTA A CLIENTE FINAL`,
      confir: "Yes"
    });
    console.log("**260", respuesta )
    if (!respuesta) return false;
    const dialogRef = this.dialog.open(FormproductosComponent, {
      data: {
        datos: {
          opt: "demo"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let respuesta = this._tools.confirm({
        title: "Solicitud enviada de manera exitosa",
        detalle: `el área encargada de proveedores tendrá un plazo de 1 a 8 días hábiles para ponerse en contacto con tigo via whatsapp`,
        confir: "Yes"
      });
    });
  }

  submitSolicitud() {
    if (this.dataSolicitud.id) this.updateSolictud(this.dataSolicitud)
    else this.enviarSolicitud(this.dataSolicitud);
  }

  enviarSolicitud(data: any) {
    return new Promise(resolve => {
      this._user.createSolicitud(data).subscribe((res: any) => {
        this.envioWhatsap();
        resolve(res);
      }, () => resolve(false));
    });
  }

  updateSolictud(data: any) {
    return new Promise(resolve => {
      this._user.updateSolicitud(data).subscribe((res: any) => {
        resolve(res);
      }, () => resolve(false));
    });
  }

  envioWhatsap() {
    let url: string = `https://wa.me/573228576900?text=`;
    window.open(url);
  }

  openImprimir() {
    //window.print();
    window.open(`${URLFRON}/imprimirTarjeta`, "Imprimir Tarjeta", "width=550, height=290");
    return false;
    var ficha = document.getElementById("tarjeta");
    var ventimp = window.open(' ', 'popimpr');
    ventimp.document.write(ficha.innerHTML);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
  }

  openPdf() {
    const documentDefinition = {
      content: [
        {
          stack: [
            'This header has both top and bottom margins defined',
            { text: 'This is a subheader', style: 'subheader' },
          ],
          style: 'header'
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'right',
          margin: [0, 190, 0, 80]
        },
        subheader: {
          fontSize: 14
        },
        superMargin: {
          margin: [20, 0, 40, 0],
          fontSize: 15
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }
  onChangeSearch( ev:any ){
    //console.log( ev )
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


}
