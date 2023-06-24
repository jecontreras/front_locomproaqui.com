import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { MatDialog } from '@angular/material';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { FormproductosComponent } from '../../form/formproductos/formproductos.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ProductosOrdenarComponent } from '../../table/productos-ordenar/productos-ordenar.component';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 10
  };
  query2:any = {
    where:{
      pro_activo: 3
    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Acciones','Foto','Nombre','Codigo', 'Cantidades', 'Precio', 'Categoria','Estado','Creado'];
  Header2:any = [ 'Acciones','Foto','Nombre', 'Precio dropshipping pro ', 'Precio Cliente Final','Estado', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;
  dataRows:any = [];
  formatoMoneda:any = {};
  counts:number = 0;

  listSeller:any = DANEGROUP;
  keyword = 'usu_usuario';
  txtCiudad:any = {};

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
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
        console.log("***72", this.rolName)
      } catch (error) {}
    });
  }

  async ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.rolName != 'administrador') this.query.where.pro_usu_creacion = this.dataUser.id;
    this.cargarTodos();
    this.cargarProveedor();
    this.listSeller = await this.getSeller();
    console.log( this.listSeller )
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormproductosComponent,{
      data: {datos: obj || {}},
      // height:  '550px',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ordenarProductos(){
    const dialogRef = this.dialog.open(ProductosOrdenarComponent,{
      data: {datos: {}},
      // height:  '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    let datos = {
      id: obj.id,
      pro_activo: 1
    }
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      if(opt.value){
        this._productos.update(datos).subscribe((res:any)=>{
          this.dataTable.dataRows.splice(idx, 1);
          this._tools.presentToast("Eliminado")
        },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
      }
    });
  }
  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
   }
  onScroll2(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query2.page++;
       this.cargarProveedor();
     }
  }
  pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  cargarTodos() {
    this.spinner.show();
    this._productos.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.counts = response.count;
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data);
        this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
        this.loader = false;
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
    for( let row of this.dataTable.dataRows ){
      row['cantidadTallas'] = 0;
      try {
        for( let key of row['listColor'] ){
          for( let item of key.tallaSelect ){
            if( item.cantidad && item.check ) row['cantidadTallas']+= Number( item.cantidad || 0 );
          }
        }
      } catch (error) { console.error("ERROR", error )}
    }
  }

  cargarProveedor() {
    this.spinner.show();
    if( this.rolName != 'administrador') this.query2.where.pro_usu_creacion = this.dataUser.id;
    this._productos.get( this.query2 ).subscribe( ( response: any ) => {
        console.log(response);
        this.dataRows.push( ... response.data );
        this.dataRows =_.unionBy( this.dataRows || [], response.data, 'id' );
        this.loader = false;
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

  buscar( opt:string ) {
    this.loader = false;
    this.notscrolly = true
    this.notEmptyPost = true;
    this.datoBusqueda = this.datoBusqueda.trim();
    if( opt === 'provedor') {
      this.dataRows = [];
      this.query2 = {
        where:{
          pro_activo: 3
        },
        limit: 10
      }
    }
    else {
      this.dataTable.dataRows = [];
      this.query = {
        where:{
          pro_activo: 0
        },
        limit: 10
      }
    }
    //console.log(this.datoBusqueda);
    if (this.datoBusqueda != '') {
      if( opt === 'provedor'){
        this.query2.where.or = [
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
      }else{
        this.query.where.or = [
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
      }
    }
    console.log("***254", this.query2)
    if( this.rolName != 'administrador') this.query.where.pro_usu_creacion = this.dataUser.id;
    if( opt === 'provedor') this.cargarProveedor();
    else this.cargarTodos();
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
