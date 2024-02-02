import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
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
      rol:"proveedor",
      estado: 0
    },
    page:0,
    limit: 50
  };
  urlColor = "#02a0e3";
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  counts:number = 0;
  filter = {
    txt: ""
  };
  dataUser: any= {};

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    public _tools: ToolsService,
    private _store: Store<CART>,
    private spinner: NgxSpinnerService,
    private _user: UsuariosService,
    private _product: ProductoService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
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
          rol:"proveedor",
          estado: 0
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
  handlePageNext(){
    this.notscrolly = false;
    this.querysStore.page++;
    this.getStore();
  }

  getStore(){
    this.spinner.show();
    return new Promise( resolve =>{
      this.querysStore.where.rol= "proveedor";
      this.querysStore.where.proValidate = true;
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

  getStores(){
    this.spinner.show();
    return new Promise( resolve =>{
      this.querysStore.where.rol= "proveedor";
      this.querysStore.where.proValidate = true;
      if( this.dataStore.id ) this.querysStore.where.pro_usu_creacion = this.dataStore.id;
      this._user.getStores( this.querysStore ).subscribe( res =>{ 
        this.counts = res.count;
        //console.log("***", this.counts)
        this.listStore = _.unionBy(this.listStore || [], res, 'id');
        this.spinner.hide();
        if (res.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  async handleProductTs( item ){
    let alert:any = await  this._tools.confirm({title:"Importante", detalle:"Deseas! Agregar Todos Los Productos de Esta Bodega", confir:"Si Acepto"});
    console.log("***", alert)
    if( alert.dismiss == "cancel" ) return false;
    let data = {
      user: this.dataUser.id,
      create: item.id
    };
    this._product.createPriceArticleFull( data ).subscribe( res =>{
      if( res.status == 400 ) return this._tools.tooast({ icon: "error",title: "Importante", detalle: res.data } )
      this._tools.tooast({ title: "Completado", detalle: "Se Agregaron Todos los Productos de Esta Bodega!!!"})
    },()=> this._tools.tooast({ icon: "error",title: "Importante", detalle: "Problemas de Conexion !!!" } ) );
  }

  handleStore( item:any ){
    this._router.navigate(['/config/store/product', item.usu_usuario ] );
  }

  handleImageError(event: any) {
    // Evento que se ejecuta cuando la imagen no se carga correctamente
    // Puedes cambiar la URL de la imagen de segunda opción aquí
    const segundaOpcionURL = './assets/imagenes/todos.png';

    // Asigna la URL de la imagen de segunda opción al src de la imagen
    event.target.src = segundaOpcionURL;
  }


}
