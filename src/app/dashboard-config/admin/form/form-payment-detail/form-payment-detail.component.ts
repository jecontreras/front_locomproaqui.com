import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-payment-detail',
  templateUrl: './form-payment-detail.component.html',
  styleUrls: ['./form-payment-detail.component.scss']
})
export class FormPaymentDetailComponent implements OnInit {

  data:any = {
    state: 0,
    accounType: 0
  };
  id:any;
  titulo:string = "Crear";
  dataUser:any = {};
  files: File[] = [];

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormPaymentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
    private _archivos: ArchivosService,
    private _supplier: SupplierAccountantService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    if(Object.keys(this.datas.data).length > 0) {
      console.log( this.datas )
      this.data = _.clone(this.datas.data);
      this.data.state = this.data.idState;
      this.id = this.data.id;
      this.titulo = "Actualizar";
    }else{this.id = ""}
  }

  fileChangeEvent(event: any): void {
    this.files = event.target.files;
    this.handleSubmitFile('photo');
  }

  handleSubmitFile(opt: string) {
    let form: any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res: any) => {
      console.log(res);
      this.data[opt] = res.files; //URL+`/${res}`;
      this.data.state = 1;
      this._tools.presentToast("Exitoso");
      this.handleSubmit();
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor") });

  }

  async handleSubmit(){
    console.log( this.data )
    return new Promise( resolve =>{
      this._supplier.update( { id: this.data.id, state: this.data.state, photo: this.data.photo, fechaPago: new Date() } ).subscribe( res=>{
        this._tools.tooast( { title: "Actualizado exitoso..." } );
        resolve( true );
      },()=> { this._tools.tooast( { icon:"error", title: "Problemas al actulizar..." } ); resolve( false ); } );
    });
  }

}
