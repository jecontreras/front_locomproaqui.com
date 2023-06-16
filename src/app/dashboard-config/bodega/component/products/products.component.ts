import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewProductosComponent } from 'src/app/components/view-productos/view-productos.component';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  dataStore:any = {};
  listArticle:any = [];
  querysArticle = {
    where:{
      pro_estado: 0
    },
    page:0,
    limit: 10
  };
  urlColor = "#02a0e3";
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
  ) { }

  ngOnInit(): void {
    console.log("***", this.activate.snapshot)
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
      this._article.get( this.querysArticle ).subscribe( res =>{
        this.counts = res.count;
        console.log("***", this.counts)
        this.listArticle = res.data;
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
