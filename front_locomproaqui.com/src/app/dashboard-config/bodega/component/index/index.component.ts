import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewProductosComponent } from 'src/app/components/view-productos/view-productos.component';
import { CART } from 'src/app/interfaces/sotarage';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  listBodegas:any = [];
  querysStore = {
    where:{
      rol: "proveedor",
      //usu_confirmar: 0
    },
    limit: 10
  };
  listArticle:any = [];
  querysArticle = {
    where:{
      pro_estado: 0,
      idPrice: 1,
      pro_activo: 0,
      pro_mp_venta: 0
    },
    limit: 10
  };
  filterStore = "";
  dataUser:any = {};
  urlColor = "#02a0e3";
  constructor(
    private _user: UsuariosService,
    private _article: ProductoService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private _store: Store<CART>,
    private _router: Router,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
     });
  }

  async ngOnInit() {
    this.spinner.show();
    await this.getStore();
    await this.getArticle();
    this.spinner.hide();
  }

  getStore(){
    return new Promise( resolve =>{
      this._user.getStore( this.querysStore ).subscribe( res=>{
        this.listBodegas = res.data;
        resolve( true );
      },()=>resolve( false ) );
    });
  }

  getArticle(){
    return new Promise( resolve =>{
      this._article.get( this.querysArticle ).subscribe( res =>{
        this.listArticle = res.data;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  handleStore( item:any ){
    this._router.navigate(['/config/store/product', item.usu_usuario ] );
    console.log("**+ENTRE", item)
  }

  handleArticle( item:any ){
    //this._router.navigate(['/config/store/product', item.id ] );
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

}
