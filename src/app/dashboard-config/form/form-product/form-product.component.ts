import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { FormproductosComponent } from '../formproductos/formproductos.component';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { Fruit } from 'src/app/interfaces/interfaces';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import { ProductosOrdenarComponent } from '../../table/productos-ordenar/productos-ordenar.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

const URL = environment.url;

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {
  data: any = {};
  id: any = 577;
  titulo: string = "Crear";
  files: File[] = [];
  files2: File[] = [];
  files3: File[] = [];
  list_files: any = [];
  listCategorias: any = [];
  listTipoTallas: any = [];
  listColor: any = [];
  editorConfig: any;
  listPrecios: any = [];
  listPreciosCliente:any = [];

  autoTicks = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;
  tickInterval = 1;


  listGaleria: any = [
    /*{
      cat_activo: 1,
      checkMayor: 0,
      foto: "https://segundav1.s3.amazonaws.com/optional/f18395a1-abfb-478c-b937-fc8fa7d4c149.jpeg.webp",
      id: 576,
      limit: 10,
      listaTallas:[
        {
          check: true,
          createdAt: "2021-02-26T19:07:14.585Z",
          id: 11,
          tal_descripcion: "35",
          tal_sw_activo: 0,
          tal_tipo: 1,
          updatedAt: "2021-02-26T19:07:14.585Z"
        }
      ],
      precioFabrica: 0,
      pro_activo: 3,
      pro_categoria: "84",
      pro_codigo: "3DBG1F",
      pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
      pro_nombre: "0E0J88",
      pro_sw_tallas: 1,
      pro_uni_venta: 110000,
      pro_usu_creacion: 23150,
      pro_vendedor: 70000,
      pro_vendedorCompra: 50000,
      todoArmare: [
        {
          cat_activo: 1,
          checkMayor: 0,
          foto: "https://segundav1.s3.amazonaws.com/optional/f18395a1-abfb-478c-b937-fc8fa7d4c149.jpeg.webp",
          id: 576,
          limit: 10,
          listaTallas:[
            {
              check: true,
              createdAt: "2021-02-26T19:07:14.585Z",
              id: 11,
              tal_descripcion: "35",
              tal_sw_activo: 0,
              tal_tipo: 1,
              updatedAt: "2021-02-26T19:07:14.585Z"
            }
          ],
          precioFabrica: 0,
          pro_activo: 3,
          pro_categoria: "84",
          pro_codigo: "3DBG1F",
          pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
          pro_nombre: "0E0J88",
          pro_sw_tallas: 1,
          pro_uni_venta: 110000,
          pro_usu_creacion: 23150,
          pro_vendedor: 70000,
          pro_vendedorCompra: 50000,
        },
        {
          cat_activo: 1,
          checkMayor: 0,
          foto: "https://segundav1.s3.amazonaws.com/optional/1670bf04-74ff-4d83-ad0a-3b466631b59f.jpeg.webp",
          id: 577,
          limit: 10,
          listaTallas:[
            {
              check: true,
              createdAt: "2021-02-26T19:07:14.585Z",
              id: 11,
              tal_descripcion: "35",
              tal_sw_activo: 0,
              tal_tipo: 1,
              updatedAt: "2021-02-26T19:07:14.585Z"
            }
          ],
          precioFabrica: 0,
          pro_activo: 3,
          pro_categoria: "84",
          pro_codigo: "3DBG1F",
          pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
          pro_nombre: "0E0J88",
          pro_sw_tallas: 1,
          pro_uni_venta: 110000,
          pro_usu_creacion: 23150,
          pro_vendedor: 70000,
          pro_vendedorCompra: 50000,
        }
      ],
    },
    {
      cat_activo: 1,
      checkMayor: 0,
      foto: "https://segundav1.s3.amazonaws.com/optional/1670bf04-74ff-4d83-ad0a-3b466631b59f.jpeg.webp",
      id: 577,
      limit: 10,
      listaTallas:[
        {
          check: true,
          createdAt: "2021-02-26T19:07:14.585Z",
          id: 11,
          tal_descripcion: "35",
          tal_sw_activo: 0,
          tal_tipo: 1,
          updatedAt: "2021-02-26T19:07:14.585Z"
        }
      ],
      precioFabrica: 0,
      pro_activo: 3,
      pro_categoria: "84",
      pro_codigo: "3DBG1F",
      pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
      pro_nombre: "0E0J88",
      pro_sw_tallas: 1,
      pro_uni_venta: 110000,
      pro_usu_creacion: 23150,
      pro_vendedor: 70000,
      pro_vendedorCompra: 50000,
      todoArmare: [
        {
          cat_activo: 1,
          checkMayor: 0,
          foto: "https://segundav1.s3.amazonaws.com/optional/f18395a1-abfb-478c-b937-fc8fa7d4c149.jpeg.webp",
          id: 576,
          limit: 10,
          listaTallas:[
            {
              check: true,
              createdAt: "2021-02-26T19:07:14.585Z",
              id: 11,
              tal_descripcion: "35",
              tal_sw_activo: 0,
              tal_tipo: 1,
              updatedAt: "2021-02-26T19:07:14.585Z"
            }
          ],
          precioFabrica: 0,
          pro_activo: 3,
          pro_categoria: "84",
          pro_codigo: "3DBG1F",
          pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
          pro_nombre: "0E0J88",
          pro_sw_tallas: 1,
          pro_uni_venta: 110000,
          pro_usu_creacion: 23150,
          pro_vendedor: 70000,
          pro_vendedorCompra: 50000,
        },
        {
          cat_activo: 1,
          checkMayor: 0,
          foto: "https://segundav1.s3.amazonaws.com/optional/1670bf04-74ff-4d83-ad0a-3b466631b59f.jpeg.webp",
          id: 577,
          limit: 10,
          listaTallas:[
            {
              check: true,
              createdAt: "2021-02-26T19:07:14.585Z",
              id: 11,
              tal_descripcion: "35",
              tal_sw_activo: 0,
              tal_tipo: 1,
              updatedAt: "2021-02-26T19:07:14.585Z"
            }
          ],
          precioFabrica: 0,
          pro_activo: 3,
          pro_categoria: "84",
          pro_codigo: "3DBG1F",
          pro_descripcion: "disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad",
          pro_nombre: "0E0J88",
          pro_sw_tallas: 1,
          pro_uni_venta: 110000,
          pro_usu_creacion: 23150,
          pro_vendedor: 70000,
          pro_vendedorCompra: 50000,
        }
      ],
    },*/
  ];

  btnDisabled: boolean = false;
  disableEliminar: boolean = false;
  tallaSelect: any = [];
  formatoMoneda:any = {};

  disableSpinner:boolean = false;
  dataUser:any = {};
  listFotos:any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [ ];
  listSubCategorias:any = [];
  rolUser:string;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  viewRt = "start";

  constructor(
    public dialog: MatDialog,
    private _productos: ProductoService,
    private _categoria: CategoriasService,
    private _tipoTallas: TipoTallasService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormproductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
  ) {
    this.editor();
    this.formatoMoneda = this._tools.currency;
    this._store.subscribe((store: any) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      if(Object.keys( this.dataUser ).length > 0 ) this.rolUser = this.dataUser.usu_perfil.prf_descripcion;
    });
  }

  ngOnInit() {
    this.disableSpinner = true;
    this.inicial();
  }
  inicial(){

    if (Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.viewRt = "end";
      if( !this.id ) {
        this.titulo = "Crear";
        this.id = ""; this.data.pro_codigo = this.codigo(); this.data.pro_sw_tallas = 1; this.disableSpinner = false; this.listFotos = [];
      }
      else {
        this.titulo = "Actualizar";
        this.listFotos = this.data.listaGaleria || [];

        this.tallaSelect = this.data.listaTallas || [];
        this.procesoEdision();
        if( this.data.pro_categoria ) this.getSubCategorias( this.data.pro_categoria );
      }
    } else { this.id = ""; this.data.pro_codigo = this.codigo(); this.data.pro_sw_tallas = 1; this.disableSpinner = false; this.listFotos = []; }
    this.getCategorias();
    this.getTipoTallas();
    this.data.activarBTN = false;
  }

  ordenActualizar() {
    const dialogRef = this.dialog.open(ProductosOrdenarComponent, {
      data: { datos: {} },
      height: '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  procesoEdision() {
    if (this.data.checkMayor) this.data.checkMayor = true;
    this.listPrecios = this.data.listPrecios || [];
    if (this.data.pro_categoria) if (this.data.pro_categoria.id) this.data.pro_categoria = this.data.pro_categoria.id;
    this.listColor = this.data.listColor || [];
    this.listPreciosCliente = this.data.listPreciosCliente || [];
    //if( !this.data.activarBTN ) this.getMisPrecios();
  }

  async getMisPrecios(){
    let result:any = await this.getPrecio( { id: this.data.id });
    if( result ) this.listPrecios = result.listPrecios || this.data.listPrecios;
  }

  getCategorias() {
    this._categoria.get({ where: { cat_activo: 0, cat_padre: null }, limit: 100 }).subscribe((res: any) => {
      this.listCategorias = res.data;
      this.disableSpinner = false;
    }, error => this._tools.presentToast("error servidor"));
  }

  getSubCategorias( id ) {
    this._categoria.get({ where: { cat_activo: 0, cat_padre: id }, limit: 100 }).subscribe((res: any) => {
      console.log( res );
      this.listSubCategorias = res.data;
      this.disableSpinner = false;
    }, error => this._tools.presentToast("error servidor"));
  }

  getTipoTallas() {
    this._tipoTallas.get({ where: { tit_sw_activo: "1" }, limit: 100 }).subscribe((res: any) => {
      this.listTipoTallas = res.data;
      if( this.data.id ) this.blurTalla(2);
    }, error => this._tools.presentToast("error servidor"));
  }

  async onSelect( event: any, item:any ) {
    console.log(event, this.files);
    this.files = [ event.addedFiles[0] ];
    setTimeout( async ()=>{
      await this.subirFile( item, 'fotoColor' );
    }, 1000 );
  }

  async onSelect2( event: any, item:any ) {
    //console.log(event, this.files);
    this.files3.push( ...event.addedFiles );
    if( !item.galeriaList ) item.galeriaList = [];
    setTimeout( async ()=>{
      await this.subirFile( item, 'colorGaleria' );
    }, 1000 );
  }



  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  finixCorteImg(){
    //Usage example:
    var file = this._tools.converBase64ImgToBynare(this.croppedImage,'hello');
    //console.log(file);
    this.files.push( file );
    this.subirFile(this.data, 'usu_imagen');
    this.croppedImage = "";
    this.imageChangedEvent = "";
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent)
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


  async subirFile( item: any = this.data, opt:string = 'foto' ) {
    let lista = this.files;
    if( opt === 'galeria') lista = this.files2;
    if( opt === 'colorGaleria') lista = this.files3;
    for( let row of lista ){
      let form: any = new FormData();
      form.append('file', row );
      this._tools.ProcessTime({});
      await this.fileNext( item, opt, form );
      if( this.id ) if( opt == 'galeria' ) { this.data.listaGaleria = this.listFotos; this.updates(); }
      if( opt == 'foto' ) this.updates();
      //this._archivos.create( this.files[0] );

    }
    this.files = [];
    this.files2 = [];
    this.files3 = [];
    item.checkFotoGaleri = false;
    item.checkFoto = false;
  }

  fileNext( item, opt, form:any ){
    return new Promise( resolve =>{
      this._archivos.create( form ).subscribe( async ( res: any ) => {
        // console.log(res);
        if ( item == false ) {
          if( opt !== 'galeria' ) this.data.foto = res.files;//URL+`/${res}`;
          else await this.validadorGaleria( res.files );
          if ( this.id ) this.submit();
        }
        else {
          if( opt == 'colorGaleria' ) {
            item.galeriaList.push( { id: this._tools.codigo( ), foto: res.files } );
          }else item.foto = res.files;
          this.submit();
        }
        this._tools.presentToast("Exitoso");
        console.log(item);
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    } );
  }

  async validadorGaleria( file:string ){
    return new Promise( resolve =>{
      this.listFotos.push( {
        id: this._tools.codigo(),
        foto: file
      });
      resolve( true );
    });
  }

  async EliminarFoto( item:any, key:any = {} ){
    this.data.listaGaleria = this.listFotos.filter( ( row:any )=> row.id != item.id );
    this.listFotos = this.listFotos.filter( ( row:any )=> row.id != item.id );
    console.log( item, this.data  );
    if( key.galeriaList ) if( key.galeriaList.length ) key.galeriaList = key.galeriaList.filter( ( row:any )=> row.id != item.id );
    await this.updates();
  }

  async guardarColor() {
    //item.check = true;
    return new Promise( async ( resolve ) =>{
      this.data.listColor = this.listColor;
      console.log(this.data, this.listColor)
      if (this.id) await this.submit();
      resolve( true );
    });
  }
  EliminarColor(idx: any) {
    this.listColor.splice(idx, 1);
    this.data.listColor = this.listColor;
    if (this.id) this.submit();
  }

  async submit() {
    return new Promise( async ( resolve )=>{
      // valida si es el administrador
      // if( !this.data.activarBTN ) return false;
      ///////////////////////////////////////////
      if (this.data.cat_activo) this.data.cat_activo = 0;
      else this.data.cat_activo = 1;
      if (this.data.checkMayor) this.data.checkMayor = 1;
      else this.data.checkMayor = 0;
      if (this.id) {
        await this.updates();
      }
      else { this.guardar(); }
      resolve( true );
    });
  }

  TallaPush() {
    this.listColor.push({
      codigo: this.codigo()
    });
  }

  PrecioPush( opt:string) {
    if( opt == "vendedor"){
      this.listPrecios.push({
        codigo: this.codigo()
      });
    }else{
      this.listPreciosCliente.push({
        codigo: this.codigo()
      });
    }
  }

  async guardarPrecios(item: any, opt:string) {
    item.check = true;
    if( opt == 'vendedor'){
      this.data.listPrecios = this.listPrecios;
    }else{
      this.data.listPreciosCliente = this.listPreciosCliente;
    }
    if ( this.id ) await this.submit();
  }

  EliminarTalla( idx: any, opt:string ) {
    if( opt == 'vendedor'){
      this.listPrecios.splice(idx, 1);
      this.data.listPrecios = this.listPrecios;
    }else{
      this.listPrecios.splice(idx, 1);
      this.data.listPreciosCliente = this.listPreciosCliente;
    }
    if ( this.id ) this.submit();
  }

  guardar() {
    return new Promise(resolve => {
      if( this.data.opt == 'demo' ) this.data.pro_mp_venta = 1;
      if( this.rolUser != 'administrador') this.data.pro_activo = 3;
      this.data.pro_usu_creacion = this.dataUser.id;
      this.data = _.omit(this.data, [ 'todoArmare' ])
      this.data = _.omitBy(this.data, _.isNull);
      this._productos.create(this.data).subscribe((res: any) => {
        //console.log(res);
        this._tools.presentToast("Exitoso");
        this.data.id = res.id;
        resolve(res);
      }, (error) => { this._tools.presentToast("Error"); resolve(false) });
    });
    //this.dialog.closeAll();
  }
  updates() {
    return new Promise( resolve =>{
      this.data = _.omit(this.data, [ 'pro_usu_creacion','todoArmare' ])
      this.data = _.omitBy(this.data, _.isNull);
      if( this.rolUser == 'administrador' ) this.data.pro_activo = 0;
      this._productos.update(this.data).subscribe((res: any) => {
        this._tools.presentToast("Actualizado");
        res.listColor = this.data.listColor;
        this.data = res;
        if( this.data.pro_sw_tallas ) this.data.pro_sw_tallas = this.data.pro_sw_tallas.id;
        if ( this.data.pro_sub_categoria ) this.data.pro_sub_categoria = this.data.pro_sub_categoria.id;
        console.log( this.data )
        this.procesoEdision();
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    })
  }
  onSelects(event: any, opt:string = 'foto') {
    //console.log(event, this.files);
    if( opt !== 'galeria') this.files.push( ...event.addedFiles );
    else this.files2.push( ...event.addedFiles );
  }


  onRemoves( event, opt:string = "foto" ) {
    //console.log(event);
    if( opt !== 'galeria' ) this.files.splice( this.files.indexOf( event ), 1 );
    else this.files2.splice( this.files.indexOf( event ), 1 );
  }

  async seleccionandoImg(item: any) {
    if (!item.id && this.btnDisabled == true) return false;
    for (let row of this.listGaleria) row.check = false;
    this.viewRt = "end";
    item.check = !item.check;
    this.btnDisabled = true;
    let result = await this.getProducto(item);
    if( result === false ) return false;
    this.data = result;
    this.id = this.data.id;
    this.btnDisabled = false;
    this.procesoEdision();
    this.blurTalla(0);
    this.croppedImage = "";
    this.imageChangedEvent = "";
    this.listColor = this.data.listColor || []
  }

  getProducto(obj: any) {
    return new Promise(resolve => {
      this._productos.get({ where: { id: obj.id } }).subscribe((res: any) => {
        res = res.data[0];
        if (!res) resolve(false);
        resolve(res);
      }, (error: any) => resolve(false));
    })
  }

  async subirFiles() {
    if( !this.data.pro_categoria ) return this._tools.tooast( { title: "Por favor debes seleccionar una categoria!!", icon: "error" } );
    this.btnDisabled = true;
    for (let row of this.files) {
      await this.fileSubmit(row);
    }
    this.files = [];
    this.btnDisabled = false;
    this._tools.presentToast("Exitoso");
    if( !this.data.id ) return false;
    this.getSubCategorias( this.data.pro_categoria );
    this.validador();

  }

  fileSubmit(row) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', row);
      this._tools.ProcessTime({});
      //this._archivos.create( this.files[0] );
      this._archivos.create(form).subscribe(async (res: any) => {
        //console.log(res);
        this.data = {
          "pro_nombre": this.codigo(),
          "foto": res.files,
          "pro_descripcion": `disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad`,
          "pro_codigo": "3DBG1F",
          "pro_sw_tallas": this.data.pro_sw_tallas,
          "pro_categoria": this.data.pro_categoria,
          "cat_activo": 1,
          "checkMayor": 0,
          "pro_uni_venta": this.data.pro_uni_venta || 0,
          "pro_vendedor": this.data.pro_vendedor || 0,
          "pro_vendedorCompra": this.data.pro_vendedorCompra || 0,
          "precioFabrica": this.data.precioFabrica || 0
        };
        this.blurTalla(0);
        let result: any = await this.guardar();
        if (!result) resolve(false);
        this.data.id = result.id;
        this.id = result.id;
        this.data.todoArmare = []
        this.listGaleria.push(this.data);
        resolve(true);
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); });
    });
  }

  validador(){
    for( let row of this.listGaleria){
      if( !row.todoArmare ) row.todoArmare = [];
      for( let item of this.listGaleria ){
        row.todoArmare.push( item );
        row.todoArmare = _.unionBy(row.todoArmare || [], row.todoArmare, 'id');
      }
    }
    console.log("****", this.listGaleria)
  }

  blurTalla(opt:number = 1) {
    console.log("****",this.data)
    let filtro = this.listTipoTallas.find(t => t.id == this.data.pro_sw_tallas);
    if (!filtro)
      return !1;
    this.tallaSelect = filtro.lista || [];
    for (let row of this.tallaSelect) row.check = !0;
    //this.tallaSelect = _.orderBy(this.tallaSelect, ["tal_descripcion"], ["asc"]);
    if( opt == 2) {
      for(let row of this.tallaSelect){
        try {
          let consult:any = this.data.listaTallas.find( ( item:any )=> item.id == row.id );
          if( !consult ) row.check = false;
        } catch (error) { continue; }
      }
    }
    this.data.listaTallas = this.tallaSelect;
    if(opt == 1) this.editarTalla();
  }

  tallaSeleccionando(t) {
    //this.data.listaTallas = _.clone( this.data.listaTallas.filter(e => e.id !== t.id) );
    this.editarTalla()
  }

  editarTalla() {
    let t = {
      id: this.data.id,
      listaTallas: this.data.listaTallas
    };
    if (!t.id)
      return !1;
    this._productos.update(t).subscribe(t => {
      this._tools.presentToast("Actualizado Tallas")
    }
      , t => {
        console.error(t);
          this._tools.presentToast("Error de servidor")
      }
    )
  }

  async actualizarProductVendedor( ){
    return new Promise( async ( resolve ) =>{
      let data:any = { id: this.data.id };
      let precio:any = await this.getPrecio( data );
      let resultado:any = Object();
      if( !precio ) {
        data = {
          user: this.dataUser.id,
          producto: this.data.id,
          precio: this.data.pro_uni_venta || 0,
          listPrecios: this.listPrecios || []
        };
        resultado = await this.createPrecio( data );
      }else{
        data = {
          id: precio.id,
          precio: this.data.pro_uni_venta || 0,
          listPrecios: this.listPrecios
        };
        resultado = await this.updatePrecio( data );
      }
      resolve( true );
    })
  }

  async getPrecio( data:any ){
    return new Promise( resolve=>{
      resolve( false );
      // this._productos.getPrecios( { where: { producto: data.id, user: this.dataUser.id }, limit: 1 }).subscribe( ( res:any )=>{
      //   res = res.data[0];
      //   if( !res ) return resolve( false );
      //   return resolve( res );
      // } ,( error:any )=> resolve( false ));
    });
  }

  async createPrecio( data ){
    return new Promise( resolve =>{
      resolve( false );
      // this._productos.createPrecios( data ).subscribe((res:any)=>resolve( res ), (error:any)=> resolve( false ));
    })
  }

  async updatePrecio( data ){
    return new Promise( resolve =>{
      resolve( false );
      // this._productos.updatePrecios( data ).subscribe((res:any)=>resolve( res ), (error:any)=> resolve( false ));
    })
  }

  async nexFunction( ){
    for( let row of this.listGaleria ){
      this.data = row;
      //console.log( this.data )
      for( let item of row.todoArmare ){
        await this.add( { value: this._tools.codigo(), foto: item.foto } );
      }
    }
    this.viewRt = 'end';
    this.data = this.listGaleria[0];
  }

  add(event: any ) {
    return new Promise( async ( resolve ) =>{
      const value = (event.value || '').trim();
      let  listas:any = [];
      let filtro = this.listColor.filter(( item:any ) => item.talla == value );
      if( filtro ) if( filtro.length > 0 ) return resolve( false );
      // Add our fruit
      for( let row of this.data.listaTallas ) listas.push( { tal_descripcion: row.tal_descripcion, id: row.id, tal_sw_activo: row.tal_sw_activo } );
      console.log( listas );
      if (value) {
        let data:any = {
          talla: value,
          id: this._tools.codigo(),
          check: true,
          foto: event.foto || '',
          tallaSelect: [],
          galeriaList: []
        };
        data.tallaSelect.push( ... _.clone( listas ) );
        this.listColor.push( data );
      }
      console.log( event )
      event.value = "";
      await this.guardarColor( );
      // Clear the input value
      try {
        event['chipInput']!.clear();
      } catch (error) {

      }
      resolve( true );
    });
  }

  remove(item: Fruit): void {
    const index = this.listColor.indexOf( item );

    if ( index >= 0 ) {
      this.listColor.splice(index, 1);
    }
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  editor() {
    let config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '300px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['bold', 'italic'],
        ['fontSize']
      ]
    };
    this.editorConfig = config;
  }

  eliminarSeleccion(item: any) {
    let data: any = { id: item.id };
    this.disableEliminar = true;
    this._productos.delete(data).subscribe((res: any) => {
      this.disableEliminar = false;
      this.listGaleria = this.listGaleria.filter((row: any) => row.id !== item.id);
      this.data = {
        pro_codigo: this.codigo(),
        pro_sw_tallas: 1
      };
      this._tools.presentToast("Eliminado Exitos");
    }, (error: any) => { this._tools.presentToast("Error de servidor"); this.disableEliminar = false; })
  }

  eventoDescripcion() {
    // console.log("HP")
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
