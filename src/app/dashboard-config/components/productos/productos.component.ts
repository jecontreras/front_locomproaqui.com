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
  Header:any = [ 'Acciones','Foto','Nombre','Codigo', 'Precio', 'Categoria','Estado', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>
  ) { 
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      console.log( store )
      if( !store.name ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {}
    });
  }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    setTimeout(()=>{
      if( this.rolName != 'administrador') this.query.where.pro_usu_creacion = this.dataUser.id;
      console.log( this.query, this.rolName, this.dataUser )
      this.cargarTodos();
    }, 2000 )
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

  cargarTodos() {
    this.spinner.show();
    this._productos.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data);
        this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
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

  buscar() {
    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
      this.query = {
        where:{
          pro_activo: 0
        },
        limit: 10
      }
      this.cargarTodos();
    } else {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
      this.cargarTodos();
    }
  }

}
