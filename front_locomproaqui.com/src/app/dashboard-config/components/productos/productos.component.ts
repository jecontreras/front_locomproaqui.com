import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
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
  loader = true;
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 30
  };
  Header:any = [ 'Acciones','Foto','Nombre','Codigo', 'Cantidades', 'Precio', 'Categoria','Estado','Creado'];
  dataUser:any = {};
  rolName:string;
  dataRows:any = [];

  _dataConfig:any = {
    tablet:{
      dataTable: {
        headerRow: this.Header,
        footerRow: this.Header,
        dataRows: []
      },
      pagina: 30
    },
    loader:true,
    query: {
      where:{
        pro_activo: 0,
      },
      sort: "createdAt DESC",
      page: 0,
      limit: 30
    }
  };
  _dataConfig2:any = {
    tablet:{
      dataTable: {
        headerRow: this.Header,
        footerRow: this.Header,
        dataRows: []
      },
      pagina: 30
    },
    loader:true,
    query: {
      where:{
        pro_activo: 0
      },
      sort: "createdAt DESC",
      page: 0,
      limit: 30
    }
  };
  _dataConfig3:any = {
    tablet:{
      dataTable: {
        headerRow: this.Header,
        footerRow: this.Header,
        dataRows: []
      },
      pagina: 30
    },
    loader:true,
    query: {
      where:{
        pro_activo: 3
      },
      sort: "createdAt DESC",
      page: 0,
      limit: 30
    },
    view: "check"
  };

  constructor(
    private _store: Store<STORAGES>,
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

  async ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this._dataConfig.query.where.pro_usu_creacion = {'!=' : this.dataUser.id };
    if( this.rolName != 'administrador') this._dataConfig2.query.where.pro_usu_creacion = this.dataUser.id;
    if( this.rolName != 'administrador') this._dataConfig3.query.where.pro_usu_creacion = this.dataUser.id;
    //this.cargarTodos();
  }
}
