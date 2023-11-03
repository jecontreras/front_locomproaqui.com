import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
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
  selector: 'app-form-list-article',
  templateUrl: './form-list-article.component.html',
  styleUrls: ['./form-list-article.component.scss']
})
export class FormListArticleComponent implements OnInit {dataStore:any = {};
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
breakpoint: number;
@ViewChild('toolbar',{static: false} ) private nav: any;
views:string;

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
  private _user: UsuariosService,
  public dialogRef: MatDialogRef<FormListArticleComponent>,
  @Inject(MAT_DIALOG_DATA) public datas: any,
) {
  this._store.subscribe((store: any) => {
    store = store.name;
    if (!store) return false;
    this.dataUser = store.user || {};
   });
}

async ngOnInit() {
  console.log("****", this.datas );
  this.views = this.datas.view || 'none';
  //console.log("***", this.activate.snapshot)
  this.querysArticle.where.user = this.dataUser.id;
  if( this.activate.snapshot.params.idStore ) this.dataStore = await this.getStore( this.activate.snapshot.params.idStore );
  this.getArticle();
  this.getCategory();
  setInterval(()=> {
    try {
      this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.dataUser.id ) {
        //console.log("**NO ENTRE",this.dataUser)
        color = this.dataUser.usu_color || "#02a0e3";
      }
      //console.log("***144",color, this.dataUser )
      this.nav.nativeElement.style.backgroundColor = color;
    } catch (error) {}
  }, 100 );
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
      if(datos.id === Number( this.activate.snapshot.params.idCategoria ) ) datos.check = true;
      this.listCategory.push(datos);
    }
    this.listCategory.unshift({
      id: 0,
      title: "TODOS",
      foto: "./assets/imagenes/todos.png",
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
  this._router.navigate( [ "/listproduct/categoria", item['id'] ] );
  this.listArticle = [];
  setTimeout(()=> this.getArticle(), 200 )
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
    if( this.activate.snapshot.params.idCategoria ) this.querysArticle.where.pro_categoria = this.activate.snapshot.params.idCategoria;
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
  if( this.views === 'none'){
    item.coinShop = false;
    item.view = 'store';
  }else item.coinShop = false;
  const dialogRef = this.dialog.open(ViewProductosComponent, {
    width: this.breakpoint == 6 ? '80%' : "100%",
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
