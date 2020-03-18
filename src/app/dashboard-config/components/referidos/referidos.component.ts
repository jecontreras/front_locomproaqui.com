import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent implements OnInit {
  
  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  tabsList:any = [];
  query:any = {
    where:{},
    page: 0
  };
  Header:any = ['Nombre','lider','E-mail','Telefonos','Nivel','Fecha Registro','Activo' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  index:any = 0;
  disabledTabs:boolean = false;

  constructor(
    private _usuarios: UsuariosService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
  ) {
    this.getTabas();
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      this.tabsList[this.index].query.where.cabeza = this.dataUser.id;
    });

   }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
  }
  
  getTabas(){
    this.tabsList = [
      {
        index: 0,
        query:{
          where:{},
          page: 0
        },
        count: 0,
        dataRows: []
      },
      {
        index: 1,
        query:{
          where:{},
          page: 0
        },
        count: 0,
        dataRows: []
      },
      {
        index: 2,
        query:{
          where:{},
          page: 0
        },
        count: 0,
        dataRows: []
      },
      {
        index: 3,
        query:{
          where:{},
          page: 0
        },
        count: 0,
        dataRows: []
      },
      {
        index: 4,
        query:{
          where:{},
          page: 0
        },
        count: 0,
        dataRows: []
      }
    ];
  }

  openIndex(ev:any){
    console.log("***", ev)
    this.disabledTabs = true;
    this.index = ev.index;
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.armandoIndex()
    this.cargarTodos();
  }



  armandoIndex(){
    if( this.index === 0 )  this.tabsList[this.index].query.where.cabeza = this.dataUser.id;
    if( this.index === 1 )  this.tabsList[this.index].query.where.cabeza = _.map(this.tabsList[0].dataRows, 'id');
    if( this.index === 2 )  this.tabsList[this.index].query.where.cabeza = _.map(this.tabsList[1].dataRows, 'id');
    if( this.index === 3 )  this.tabsList[this.index].query.where.cabeza = _.map(this.tabsList[2].dataRows, 'id');
    if( this.index === 4 )  this.tabsList[this.index].query.where.cabeza = _.map(this.tabsList[3].dataRows, 'id');
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.tabsList[this.index].query.page++;
       this.cargarTodos();
     }
   }

  cargarTodos() {
    this.spinner.show();
    this._usuarios.get(this.tabsList[this.index].query)
    .subscribe(
      (response: any) => {
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        //if(this.index > 0) if(response.count > this.tabsList[this.index].count )  { this.tabsList[this.index-1].query.limit = 1000; this.cargarTodos(); return false; }
        if(this.tabsList[this.index]){
          this.tabsList[this.index].dataRows.push(... response.data);
          this.tabsList[this.index].dataRows =_.unionBy(this.tabsList[this.index].dataRows || [], response.data, 'id');
        }
        console.log(this.tabsList)
        this.disabledTabs = false;
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
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    //this.dataTable.dataRows = [];
    this.tabsList[this.index].dataRows = [];
    if (this.datoBusqueda === '') {
      this.tabsList[this.index].query = {where:{},page: 0};
      this.tabsList[this.index].query.where.cabeza = this.dataUser.id;
      this.cargarTodos();
    } else {
      this.tabsList[this.index].query.page = 0;
      this.tabsList[this.index].query.where.or = [
        {
          usu_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_email: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_apellido: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_telefono: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
      this.cargarTodos();
    }
  }

}
