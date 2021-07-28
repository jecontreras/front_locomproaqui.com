import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-formcrearguia',
  templateUrl: './formcrearguia.component.html',
  styleUrls: ['./formcrearguia.component.scss']
})
export class FormcrearguiaComponent implements OnInit {

  data:any = {};
  dataUser:any = {};

  constructor(
    public dialogRef: MatDialogRef<FormcrearguiaComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
    private _ventas: VentasService
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};

    });
  }

  ngOnInit(): void {
    if (Object.keys(this.datas.datos).length > 0) {
      this.data = this.datas.datos || {};
    }
    this.rellenoData();
  }

  rellenoData(){
    this.data = {
      idCiudadOrigen: "54001000",
      idCiudadDestino: this.data.codeCiudad,
      "selectEnvio": "contraEntrega",
      "valorMercancia": this.data.valorMercancia,
      "fechaRemesa": moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      "idUniSNegogocio": 1,
      "numeroUnidad": this.data.numeroUnidad,
      "pesoReal": this.data.pesoReal,
      "pesoVolumen": this.data.pesoVolumen,
      "alto": this.data.alto,
      "largo": this.data.largo,
      "ancho": this.data.ancho,
      "drpCiudadOrigen": "CUCUTA-NORTE DE SANTANDER",
      "txtIdentificacionDe": this.dataUser.usu_documento || 1090519754,
      "txtTelefonoDe": this.dataUser.usu_telefono,
      "txtDireccionDe": this.dataUser.usu_direccion,
      "txtCod_Postal_Rem": 540001,
      "txtEMailRemitente": this.dataUser.usu_email,
      "txtPara": this.data.ven_nombre_cliente,
      "txtIdentificacionPara": this.data.cob_num_cedula_cliente,
      "drpCiudadDestino": this.data.ciudadDestino,
      "txtTelefonoPara": this.data.ven_telefono_cliente,
      "txtDireccionPara": this.data.ven_direccion_cliente,
      "txtDice": "zapatos",
      "txtNotas": "ok",
      "txtEMailDestinatario": "joseeduar147@gmail.com",
    };
  }

  submit(){
    console.log( this.data)
    this._ventas.createFelte( this.data ).subscribe( ( res:any ) => {
      console.log( res );
    });
  }

}
