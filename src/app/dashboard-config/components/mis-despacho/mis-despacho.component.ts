import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-mis-despacho',
  templateUrl: './mis-despacho.component.html',
  styleUrls: ['./mis-despacho.component.scss']
})
export class MisDespachoComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{

    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Foto','Producto','Numero Guia', 'Logo', 'Estado Venta', 'Cantidad', 'Precio Distribuidor', 'Talla', 'Color', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;
  opcionCurrencys:any;
  reacudo:number;
  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _usuarios: UsuariosService
  ) { 
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {}
    });
  }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
    this.getDineros();
  }

  getDineros(){
    this._usuarios.getRecaudo( { where: { usuario: this.dataUser.id } } )
    .subscribe( (res: any ) => {
      try {
        this.reacudo = res.data[0].valor;
      } catch (error) {
        this.reacudo = 0;
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
    this._productos.getVenta( this.query )
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
    this.query = {
      where:{},
      limit: 10
    };
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          colorSelect: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          titulo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
  }

}
