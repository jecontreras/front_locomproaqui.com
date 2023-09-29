import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewProductosComponent } from 'src/app/components/view-productos/view-productos.component';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-list-article-store',
  templateUrl: './list-article-store.component.html',
  styleUrls: ['./list-article-store.component.scss']
})
export class ListArticleStoreComponent implements OnInit {
  dataStore:any = {};
  listArticle:any = [];
  listCategory: any = [];
  querysArticle:any = {
    where:{
      pro_estado: 0,
      idPrice: 1,
      pro_activo: 0,
      pro_mp_venta: 0
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
  dataUser:any = {};

  constructor(
    private activate: ActivatedRoute,
    private _article: ProductoService,
    public dialog: MatDialog,
    private _router: Router,
    public _tools: ToolsService,
    public _formato: FormatosService,
    private _store: Store<CART>,
    private spinner: NgxSpinnerService,
    private _category: CategoriasService,
    private _user: UsuariosService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
     });
  }

  async ngOnInit() {
    console.log("***", this.activate.snapshot)
    this.querysArticle.where.user = this.dataUser.id;
    if( this.activate.snapshot.params.idStore ) this.dataStore = await this.getStore( this.activate.snapshot.params.idStore );
    this.getArticle();
    this.getCategory();
  }

  getStore( id:string ){
    return new Promise( resolve =>{
      this._user.get( { where:{ usu_usuario: id }}).subscribe(res=>{
        resolve( res.data[0] || { } );
      },()=> resolve( {} ) );
    })
  }

  getCategory(){
    this._category.get({ where: { cat_activo: 0, cat_padre: null }, limit: 1000 }).subscribe( async (res: any) => {
      for (let row of res.data) {
        let datos: any = {
          id: row.id,
          title: row.cat_nombre,
          subCategoria: await this.getSubCategory( row.id )
        };
        this.listCategory.push(datos);
      }
      this.listCategory.unshift({
        id: 0,
        title: "TODOS",
        subCategoria: []
      });
    });
  }

  async getSubCategory( id:any ){
    return new Promise ( resolve =>{
      this._category.get( { where: { cat_padre: id, cat_activo: 0 }, limit: 1000 } ).subscribe(( res:any )=>{
        resolve( res.data );
      }, ()=> resolve( false ) );
    });
  }

  handleCategorySearch( item ){
    item.check = !item.check;
    for( let row of this.listCategory ) { if( row.id != item.id ) row.check = false; }
    this.querysArticle.where.pro_categoria = item.id;
    if( this.querysArticle.where.pro_categoria == 0 ) delete this.querysArticle.where.pro_categoria;
    this.listArticle = [];
    this.getArticle();
  }

  handleSearch(){
    console.log("***90", this.filter)
    if( this.filter.txt === ''){
      this.querysArticle = {
        where: {
          pro_estado: 0,
          idPrice: 1,
          pro_activo: 0,
          pro_mp_venta: 0
        },
        limit: 50,
        page: 0
      };
    }else {
      this.querysArticle.where.or = [
        {
          pro_nombre: {
            contains: this.filter.txt || ''
          }
        },
        {
          pro_codigo: {
            contains: this.filter.txt || ''
          }
        }
      ];
    }
    this.listArticle = [];
    this.getArticle();
  }

  onScroll( ev:any ){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.querysArticle.page = ev.pageIndex;
        this.querysArticle.limit = ev.pageSize;
       this.getArticle();
     }
   }

  getArticle(){
    this.spinner.show();
    return new Promise( resolve =>{
      if( this.dataStore.id ) this.querysArticle.where.pro_usu_creacion = this.dataStore.id;
      this._article.get( this.querysArticle ).subscribe( res =>{
        this.counts = res.count;
        console.log("***", this.counts)
        this.listArticle = _.unionBy(this.listArticle || [], res.data, 'id');
        this.spinner.hide();
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  handleArticle( item:any ){
    item.coinShop = false;
    item.view = 'store';
    const dialogRef = this.dialog.open(ViewProductosComponent, {
      width: '100%',
      maxHeight: "700%",
      data: { datos: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      //this._router.navigate(['/pedidos']);
    });
  }

  handleStore( item:any ){
    this._router.navigate(['/config/store/product', item.id ] );
  }


}
