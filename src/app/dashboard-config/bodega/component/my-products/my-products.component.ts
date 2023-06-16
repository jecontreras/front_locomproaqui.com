import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewProductosComponent } from 'src/app/components/view-productos/view-productos.component';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  dataStore:any = {};
  listArticle:any = [];
  querysArticle = {
    where:{
      state: 0
    },
    page:0,
    limit: 10
  };
  urlColor = "#02a0e3";
  dataUser:any = {};
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  counts:number = 0;

  constructor(
    private activate: ActivatedRoute,
    private _article: ProductoService,
    public dialog: MatDialog,
    private _router: Router,
    public _tools: ToolsService,
    private spinner: NgxSpinnerService,
    private _store: Store<CART>,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
     });
  }

  ngOnInit(): void {
    console.log("***", this.activate.snapshot, this.dataUser)
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
      this._article.getPriceArticle( this.querysArticle ).subscribe( res =>{
        this.listArticle = res.data;
        this.counts = res.count;
        this.spinner.hide();
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  getArticleId( id:number ){
    return new Promise( resolve =>{
      this._article.get({ where: { id:id } } ).subscribe(res =>{
        res = res.data[0];
        resolve( res );
      },()=> resolve( {} ) );
    });
  }

  async handleArticle( item:any ){
    console.log("***", item)
    let result:any = await this.getArticleId( item.article.id );
    result.coinShop = false;
    result.idMyProduct = item.id;
    result.view = 'store';
    const dialogRef = this.dialog.open(ViewProductosComponent, {
      width: '100%',
      maxHeight: "700%",
      data: { datos: result }
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(`Dialog result: ${res}`);
      if( res === 'update' ) {
        this.listArticle = this.listArticle.filter( off => off.id != item.id );
      }
      //this._router.navigate(['/pedidos']);
    });
  }

  handleStore( item:any ){
    this._router.navigate(['/config/store/product', item.id ] );
  }


}
