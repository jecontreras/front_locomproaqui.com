import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
      usu_confirmar: 0
    },
    limit: 10
  };
  listArticle:any = [];
  querysArticle = {
    where:{
      pro_estado: 0
    },
    limit: 10
  };
  constructor(
    private _user: UsuariosService,
    private _article: ProductoService,
    private _router: Router,
  ) {

  }

  async ngOnInit() {
    await this.getStore();
    await this.getArticle();
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
    this._router.navigate(['/config/store/product', item.id ] );
  }

  handleArticle( item:any ){
    this._router.navigate(['/config/store/product', item.id ] );
  }

}
