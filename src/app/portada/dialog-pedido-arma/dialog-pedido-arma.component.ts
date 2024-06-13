import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-dialog-pedido-arma',
  templateUrl: './dialog-pedido-arma.component.html',
  styleUrls: ['./dialog-pedido-arma.component.scss']
})
export class DialogPedidoArmaComponent implements OnInit {
  data:any = {
    talla: 0,
  };
  constructor(
    public dialogRef: MatDialogRef<DialogPedidoArmaComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools:ToolsService
  ) { }

  ngOnInit(): void {
    console.log("***20", this.datas)
    this.data.foto = this.datas.foto;
  }

  handleSelectT( talla:number ){
    this.data.talla = talla;
  }

  finalizando(){
    if( !this.data.talla ) { this._tools.presentToast("Por favor, seleccionar una talla"); return false; }
    if( !this.data.cantidad ) { this._tools.presentToast("Por favor, ingresar cantidad"); return false; }
    this.dialogRef.close( this.data );
  }

}
