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
    limit: 10
  };
  urlColor = "#02a0e3";
  dataUser:any = {};
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

  getArticle(){
    this.spinner.show();
    return new Promise( resolve =>{
      this._article.getPriceArticle( this.querysArticle ).subscribe( res =>{
        this.listArticle = res.data;
        this.spinner.hide();
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
