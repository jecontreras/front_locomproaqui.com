import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  dataStore:any = {};
  listStore:any = [];
  querysStore:any = {
    where:{
      rol:"proveedor"
    },
    page:0,
    limit: 10
  };
  urlColor = "#02a0e3";
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  counts:number = 0;
  filter = {
    txt: ""
  }

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    public _tools: ToolsService,
    private _store: Store<CART>,
    private spinner: NgxSpinnerService,
    private _user: UsuariosService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
     });
  }

  async ngOnInit() {
    this.getStore();
  }
  handleSearch(){
    console.log("***90", this.filter)
    if( this.filter.txt === ''){
      this.querysStore = {
        where: {
          pro_estado: 0,
          idPrice: 1,
          pro_activo: 0,
          pro_mp_venta: 0
        },
        limit: 10,
        page: 0
      };
    }else {
      this.querysStore.where.or = [
        {
          usu_usuario: {
            contains: this.filter.txt || ''
          }
        },
        {
          usu_telefono: {
            contains: this.filter.txt || ''
          }
        },
        {
          usu_nombre: {
            contains: this.filter.txt || ''
          }
        },
        {
          usu_email: {
            contains: this.filter.txt || ''
          }
        },
        {
          usu_ciudad: {
            contains: this.filter.txt || ''
          }
        },
      ];
    }
    this.listStore = [];
    this.getStore();
  }

  onScroll( ev:any ){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.querysStore.page = ev.pageIndex;
        this.querysStore.limit = ev.pageSize;
       this.getStore();
     }
   }

  getStore(){
    this.spinner.show();
    return new Promise( resolve =>{
      this.querysStore.where.rol= "proveedor";
      if( this.dataStore.id ) this.querysStore.where.pro_usu_creacion = this.dataStore.id;
      this._user.getStore( this.querysStore ).subscribe( res =>{
        this.counts = res.count;
        console.log("***", this.counts)
        this.listStore = _.unionBy(this.listStore || [], res.data, 'id');
        this.spinner.hide();
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  handleStore( item:any ){
    this._router.navigate(['/config/store/product', item.usu_usuario ] );
  }


}
