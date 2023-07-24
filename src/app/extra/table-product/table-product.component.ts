import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { FormproductosComponent } from 'src/app/dashboard-config/form/formproductos/formproductos.component';
import { ProductosOrdenarComponent } from 'src/app/dashboard-config/table/productos-ordenar/productos-ordenar.component';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';

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
      limit: 10
    }
  };

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
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
        console.log("***72", this.rolName)
      } catch (error) {}
    });
  }

  async ngOnInit() {
    //this._dataConfig.query.where.pro_usu_creacion = this.dataUser.id;
    this.cargarTodos();
    this.listSeller = await this.getSeller();
    console.log( this._dataConfig )
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
        console.log(response);
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
      } catch (error) { console.error("ERROR", error )}
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
    this.cargarTodos();
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
