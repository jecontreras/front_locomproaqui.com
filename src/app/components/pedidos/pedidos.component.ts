import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  query:any = {
    where:{

    },
    limit: 100
  };
  listProductos:any = [];
  constructor(
    private _productos: ProductoService
  ) { 

    this.cargarProductos();
  }

  ngOnInit() {
  }
  cargarProductos(){
    this._productos.get(this.query).subscribe((res:any)=>{
        console.log("res", res);
        this.listProductos=res.data;
    });
  }

}
