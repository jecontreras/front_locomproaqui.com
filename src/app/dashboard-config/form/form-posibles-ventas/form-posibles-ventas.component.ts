import { Component, OnInit, Inject } from '@angular/core';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-posibles-ventas',
  templateUrl: './form-posibles-ventas.component.html',
  styleUrls: ['./form-posibles-ventas.component.scss']
})
export class FormPosiblesVentasComponent implements OnInit {
  data: any = {};
  clone: any = {};
  id: any;
  titulo: string = "Ver Posible Venta";
  dataUser: any = {};
  disabledButton: boolean = false;
  disabled: boolean = false;
  listTallas: any = [];
  mensajeWhat: string;

  disableBtnFile: boolean = false;
  urlImagen: any;
  opcionCurrencys: any = {};
  disableSpinner:boolean = true;
  constructor(
    private _ventas: VentasService,
    public dialogRef: MatDialogRef<FormPosiblesVentasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) { 
    this.data = _.clone(this.datas.datos);
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(){
    this._ventas.getPossibleSales({ where: { id: this.id }}).subscribe(res=>{
      res = res.data[0];
      this.data = res;
      this.disableSpinner = false;
    });
  }

  async submit() {}

}
