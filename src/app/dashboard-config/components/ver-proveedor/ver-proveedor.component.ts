import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ver-proveedor',
  templateUrl: './ver-proveedor.component.html',
  styleUrls: ['./ver-proveedor.component.scss']
})
export class VerProveedorComponent implements OnInit {
  titulo:string = "Ver detalles";
  seart:any = {
    txt: ""
  };
  data:any = {
    foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/1583.jpg",
    nombre: "UNMERCO Medellín sede principal",
    countProducto: 23
  };
  listCategorias:any = [];
  listRow:any = [];
  query:any = {
    where:{
      pro_activo: 0,
      pro_mp_venta: 0
    },
    page: 0,
    limit: 10
  };
  id:any;
  notscrolly: boolean = true;
  notEmptyPost: boolean = true;
  loader: boolean = false;

  constructor(
    private _categorias: CategoriasService,
    private _productos: ProductoService,
    private activate: ActivatedRoute,
    private _user: UsuariosService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {  
    if( this.activate.snapshot.paramMap.get('id')){
      this.id = ( this.activate.snapshot.paramMap.get('id') );
      this.getUser();
      this.getList();
   }
    this.getCategorias();
  }

  getUser(){
    this._user.get( { where: { id: this.id }, limit: 1 } ).subscribe( ( res:any ) => {
      this.data = res.data[0] || {};
      console.log( this.data )
    });
  }

  getCategorias(){
    this._categorias.get( { where: { cat_activo: 0, cat_padre: null }, limit: 1000  }).subscribe(( res:any )=>{
      this.listCategorias = res.data;
    });
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      this.query.page++;
      this.getList();
    }
  }

  getList(){
    this.spinner.show();
    this.query.where.pro_usu_creacion = this.id;
    this._productos.get( this.query ).subscribe(( res:any )=>{
      this.data.countProducto = res.count;
      this.listRow = _.unionBy(this.listRow || [], res.data, 'id');

      if (res.data.length === 0) {
        this.notEmptyPost = false;
      }
      this.notscrolly = true;
      this.spinner.hide();
    });
  }

  buscar() {
    //console.log(this.seartxt);
    this.loader = true;
    try { this.seart.txt = this.seart.txt.trim(); } catch (error) { this.seart.txt = ""; }
    this.listRow = [];
    this.notscrolly = true;
    this.notEmptyPost = true;
    if (this.seart.txt === '') {
      this.query = { where: { pro_activo: 0 }, limit: 18, page: 0 };
      this.getList();
    } else {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.seart.txt || ''
          }
        },
        {
          pro_codigo: {
            contains: this.seart.txt || ''
          }
        }
      ];
      this.getList();
    }
  }

}
