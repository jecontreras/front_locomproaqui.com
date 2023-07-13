import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { BancosService } from 'src/app/servicesComponents/bancos.service';

@Component({
  selector: 'app-form-disbursement',
  templateUrl: './form-disbursement.component.html',
  styleUrls: ['./form-disbursement.component.scss']
})
export class FormDisbursementComponent implements OnInit {

  disabledButton:boolean = false;
  id:any;
  data:any = {};
  opcionCurrencys: any = {};
  superSub:boolean = false;
  clone:any = {};
  dataUser:any = {};
  listBank:any = [];

  constructor(
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
    private _bank: BancosService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });
  }

  ngOnInit(): void {
    this.getBank();
  }

  getBank(){
    this._bank.get( { where: { user: this.dataUser.id } } ).subscribe(res=>{
      this.listBank = res.data;
      if( this.listBank.length === 0 ) return this._tools.presentToast("¡Lo Sentimos primero debes agregar los datos bancarios!");
    });
  }

  submit(){
    this.disabledButton = true;
    if( this.id ) {
      if(!this.superSub) if(this.clone.ven_estado == 1) { this._tools.presentToast("Error no puedes ya editar el Cobro ya esta aprobada"); return false; }
      this.updates();
    }
    else this.guardar();
  }

  updates(){

  }

  guardar(){

  }

}
