import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-ver-catalago-proveedor',
  templateUrl: './ver-catalago-proveedor.component.html',
  styleUrls: ['./ver-catalago-proveedor.component.scss']
})
export class VerCatalagoProveedorComponent implements OnInit {
  sear:any = {
    opt: "",
    text: ""
  };
  listTendencia:any = [];
  listDestacados:any = [];
  listRecomendados:any = [];
  listRentables:any = [];

  queryTendencia:any = {
    where:{
      pro_activo: 0,
      pro_mp_venta: 0,
      pro_usu_creacion: { '!=': 1 }
    },
    sort: "createdAt ASC",
    page: 0,
    limit: 4  
  };

  querysDestacados:any = {
    where:{
      rolName: 'proveedor'
    },
    page: 0,
    limit: 4  
  };

  queryRecomendados:any = {
    where:{
      pro_activo: 0,
      pro_mp_venta: 0,
      pro_usu_creacion: { '!=': 1 }
    },
    sort: "pro_vendedor ASC",
    page: 0,
    limit: 4  
  };

  queryRentables:any = {
    where:{
      pro_activo: 0,
      pro_mp_venta: 0,
      pro_usu_creacion: { '!=': 1 }
    },
    sort: "createdAt DESC",
    page: 0,
    limit: 4  
  };

  constructor(
    private _productos: ProductoService,
    private _user: UsuariosService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.spinner.show();
    }, 1000 );
    this.getListTendencia();
    this.getListaProveedor();
    this.getRecomendados();
    this.getRentables();
  }

  getListTendencia(){
    this._productos.get( this.queryTendencia ).subscribe(( res:any )=>{
      this.listTendencia = res.data;
    });
  }

  getListaProveedor(){
    this._user.get( this.querysDestacados ).subscribe(( res:any )=>{
      this.listDestacados = res.data;
    });
  }

  getRecomendados(){
    this._productos.get( this.queryRecomendados ).subscribe(( res:any )=>{
      this.listRecomendados = res.data;
    })
  }

  getRentables(){
    this._productos.get( this.queryRentables ).subscribe(( res:any )=>{
      this.listRentables = res.data;
      this.spinner.hide();
    })
  }

  buscarFTP(){

  }

}
