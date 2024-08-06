import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { FormProductComponent } from 'src/app/dashboard-config/form/form-product/form-product.component';
import { FormproductosComponent } from 'src/app/dashboard-config/form/formproductos/formproductos.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-table-product',
  templateUrl: './table-product.component.html',
  styleUrls: ['./table-product.component.scss']
})
export class TableProductComponent implements OnInit {

  @Input() _dataConfig:any = {
    tablet:{
      dataTable: {
        headerRow: [],
        footerRow: [],
        dataRows: []
      },
      pagina: 10
    },
    loader:true,
    query: {
      where:{
        pro_activo: 0
      },
      page: 0,
      sort: 'createdAt DESC',
      limit: 30
    }
  };

  disabledBtn:boolean = false;
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;

  listSeller:any = DANEGROUP;
  keyword = 'usu_usuario';
  txtCiudad:any = {};
  counts:number;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _user: UsuariosService
  ) {
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try { this.disabledBtn = this.dataUser.estado === 0 ? true : false; } catch (error) { }
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {}
    });
  }

  async ngOnInit() {
    //this._dataConfig.query.where.pro_usu_creacion = this.dataUser.id;
    this.cargarTodos();
    this.listSeller = await this.getSeller();
    console.log("dataConfig", this._dataConfig)
  }

  async handleCreate(){
    if( this.disabledBtn === false && this.rolName === 'vendedor' ) {
      if( this.dataUser.pdfRut && this.dataUser.pdfCc && this.dataUser.pdfCComercio && this.dataUser.usu_ciudad && this.dataUser.usu_direccion && this.dataUser.tipeUser ) return this._tools.error( { mensaje: "¡Lo sentimos Tu cuenta Todavía no ha sido activado por favor esperes unos minutos mientras validamos tu información!", footer: `<a target="_blank" href="${ window.location.origin }/config/perfil" >Completar Cuenta</a>` })
      return this._tools.error( { mensaje: "¡Lo sentimos no puedes crear artículos por favor completar perfil!", footer: `<a target="_blank" href="${ window.location.origin }/config/perfil" >Completar Cuenta</a>` })
    }
    return this.crearAnt(false);
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormProductComponent,{
      data: {datos: obj || {}},
      // height:  '550px',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  async handleDouble(row){
    if( row.btnDisabled === true ) return false;
    let validate = await this._tools.confirm({title:"Duplicar Item", detalle:"¿Deseas duplicar este producto?", confir:"Si duplicar"});
    if( !validate.value ) return false;
    row.btnDisabled = true;
    let data = row;
    data = _.omit(data, [ 'id', 'createdAt', 'updatedAt', 'listComment', 'idAleatorio'])
    data = _.omitBy(data, _.isNull);
    data.pro_usu_creacion = row.pro_usu_creacion.id;
    data.pro_categoria = row.pro_categoria.id;
    data.pro_codigo = 'copia '+ row.pro_codigo;
    this._productos.create( data ).subscribe( async ( res ) =>{
      this._tools.presentToast("Duplicado exitoso");
      let dts = await this.getId( res.id );
      if( dts ) this.crearAnt( dts );
      row.btnDisabled = false;
    },( )=> {
      this._tools.presentToast("Problemas actualizar pagina...")
      row.btnDisabled = false;
    } );
  }
  getId( id:number ){
    return new Promise( resolve =>{
      this._productos.get( { where:{ id: id } } ).subscribe( res =>{
        resolve( res.data[0] || false );
      })
    })
  }
  crearAnt(obj:any){
    const dialogRef = this.dialog.open(FormproductosComponent,{
      data: {datos: obj || {}},
      // height:  '550px',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  handleInactivate(obj:any, idx:any){
    let datos = {
      id: obj.id,
      pro_activo: 3
    }
    this._tools.confirm({title:"Inactivar", detalle:"Deseas Inactivar este Producto?", confir:"Si Inactivar"}).then((opt)=>{
      if(opt.value){ console.log("datos", datos)
        this._productos.update(datos).subscribe((res:any)=>{
          this._dataConfig.tablet.dataTable.dataRows.splice(idx, 1);
          this._tools.presentToast("Producto Inactvo")
        },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
      }
    });
  }
  handleDelete(obj:any, idx:any){
    let datos = {
      id: obj.id,
      pro_activo: 1
    }
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      if(opt.value){
        this._productos.update(datos).subscribe((res:any)=>{
          this._dataConfig.tablet.dataTable.dataRows.splice(idx, 1);
          this._tools.presentToast("Eliminado")
        },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
      }
    });
  }
  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this._dataConfig.query.page++;
       this.cargarTodos();
     }
   }
  pageEvent(ev: any) {
    this._dataConfig.query.page = ev.pageIndex;
    this._dataConfig.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  cargarTodos() {
    this.spinner.show();
    this._productos.get( this._dataConfig.query )
    .subscribe(
      (response: any) => {
        this.counts = response.count;
        this._dataConfig.tablet.dataTable.headerRow = this._dataConfig.headerRow;
        this._dataConfig.tablet.dataTable.footerRow = this._dataConfig.tablet.dataTable.footerRow;
        this._dataConfig.tablet.dataTable.dataRows.push(... response.data);
        this._dataConfig.tablet.dataTable.dataRows =_.unionBy(this._dataConfig.tablet.dataTable.dataRows || [], response.data, 'id');
        this._dataConfig.loader = false;
        this.cantidadUnidades();
        this.spinner.hide();

        if (response.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
      },
      error => {
        console.log('Error', error);
      });
  }

  cantidadUnidades(){
    for( let row of this._dataConfig.tablet.dataTable.dataRows ){
      row['cantidadTallas'] = 0;
      try {
        for( let key of row['listColor'] ){
          for( let item of key.tallaSelect ){
            if( item.cantidad && item.check ) row['cantidadTallas']+= Number( item.cantidad || 0 );
          }
        }
      } catch (error) { /*console.error("ERROR Controlado", error )*/}
    }
  }

  buscar( opt:string ) {
    this._dataConfig.loader = false;
    this.notscrolly = true
    this.notEmptyPost = true;
    this.datoBusqueda = this.datoBusqueda.trim();
    this._dataConfig.tablet.dataTable.dataRows = [];
    //console.log(this.datoBusqueda);
    if (this.datoBusqueda != '') {
      this._dataConfig.query.where.or = [
        {
          pro_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }else {
      delete this._dataConfig.query.where.or;
    }
    if( this.rolName != 'administrador') this._dataConfig.query.where.pro_usu_creacion = this.dataUser.id;
    this._dataConfig.query.limit = 10;
    this._dataConfig.query.page = 0;
    this._dataConfig.query.sort = "createdAt DESC";
    this.cargarTodos();
  }
  async updateState( item, opt ){
    let validate = await this._tools.confirm({title:"Actualizar", detalle:"¿Deseas cambiar de estado este producto?", confir:"Si activar"});
    if( !validate.value ) return false;
    let data:any ={
      id: item.id
    };
    data[opt] = item[opt];
    if( item.pro_uni_venta ) data.pro_activo = 0;
    this._productos.updateState( data ).subscribe(( res:any )=>{
      this._tools.tooast( {title: "Actualizado " + opt } );
    },( error )=> this._tools.tooast( "Error " + opt ));
  }
  updatePrecio( item, opt ){
    let data:any ={
      id: item.id
    };
    data[opt] = item[opt];
    if( item.pro_uni_venta ) data.pro_activo = 0;
    this._productos.update( data ).subscribe(( res:any )=>{
      this._tools.tooast( "Actualizado " + opt );
    },( error )=> this._tools.tooast( "Error " + opt ));
  }

  getSeller(){
    return new Promise( resolve =>{
      this._user.getStore( { where: { rol:"proveedor" }, limit: 1000000000 } ).subscribe( res =>{
        return resolve( res.data || [] );
      });
    });
  }

  handleSelectShop( ev:any ){
    console.log("**EV", ev);
  }

  onChangeSearch( ev:any ){
    console.log( ev )

  }



}
