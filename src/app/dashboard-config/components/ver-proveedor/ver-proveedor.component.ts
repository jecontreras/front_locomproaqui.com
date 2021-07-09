import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

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

  constructor(
    private _categorias: CategoriasService,
    private _productos: ProductoService
  ) { }

  ngOnInit(): void {  
    this.getCategorias();
    this.getList();
  }

  getCategorias(){
    this._categorias.get( { where: { cat_activo: 0, cat_padre: null }, limit: 1000  }).subscribe(( res:any )=>{
      this.listCategorias = res.data;
    });
  }

  getList(){
    this._productos.get( this.query ).subscribe(( res:any )=>{
      this.listRow = res.data;
    });
  }

}
