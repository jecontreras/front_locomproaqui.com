import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-productos-ordenar',
  templateUrl: './productos-ordenar.component.html',
  styleUrls: ['./productos-ordenar.component.scss']
})
export class ProductosOrdenarComponent implements OnInit {
  
  listGaleria:any = [];
  id:string = "";
  titulo:string = "Crear";
  btndisabled:boolean = false;

  listGaleria2:any = [];

  constructor(
    private _productos: ProductoService,
    private _tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(){
    this._productos.get( { where:{ pro_activo: 0 }, limit: -1 } ).subscribe((res:any)=> { this.listGaleria = _.clone( res.data ); this.listGaleria2 = _.clone( res.data ); } );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  actualizarOrden(){
    let ordenar = []
    // for( let row of this.listGaleria ) ordenar.push({ id: row.id });
    for( let row of this.listGaleria2 ) ordenar.push({ id: row.id });
    ordenar =_.unionBy( ordenar || [], ordenar, 'id');
    this.btndisabled = true;
    this._productos.ordenar( { lista: ordenar } ).subscribe((res:any)=> {
      this.btndisabled = false;
      this._tools.presentToast("Productos Ordenados");
    },( error:any )=> this.btndisabled = false);
  }

}
