import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-dialogconfirmar-pedido',
  templateUrl: './dialogconfirmar-pedido.component.html',
  styleUrls: ['./dialogconfirmar-pedido.component.scss']
})
export class DialogconfirmarPedidoComponent implements OnInit {
  data:any = {};
  disabled:boolean = false;
  valor:number = 0;
  dataUser:any = {};
  listCarrito:any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogconfirmarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService
  ) { 

  }

  ngOnInit(): void {
    this.datas = this.datas.datos || {};
    console.log( this.datas );
    this.listCarrito = this.datas.listCart;
    this.data.total = this.datas.total;
    this.suma();
  }

  async finalizando(){
    let validador = this.validador();
    if( !validador ) return false;
    if( this.disabled ) return false;
    this.disabled = true;
    this.dialogRef.close( this.data );

  }

  suma(){
    this.data.costo = ( this.data.opt == true ? ( this.datas.pro_uni_venta * 2 || 210000 ) - 20000 : ( this.datas.pro_uni_venta * this.data.cantidadAd )  || 105000 )
    console.log( this.datas )
  }

  validador(){
    if( !this.data.nombre ) { this._tools.tooast( { title: "Error falta el nombre ", icon: "error"}); return false; }
    if( !this.data.telefono ) { this._tools.tooast( { title: "Error falta el telefono", icon: "error"}); return false; }
    if( !this.data.direccion ) { this._tools.tooast( { title: "Error falta la direccion ", icon: "error"}); return false; }
    if( !this.data.ciudad  ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    if( !this.data.barrio ) { this._tools.tooast( { title: "Error falta el barrio ", icon: "error"}); return false; }
    //if( !this.data.talla ) { this._tools.tooast( { title: "Error falta la talla ", icon: "error"}); return false; }
    return true;
  }

}