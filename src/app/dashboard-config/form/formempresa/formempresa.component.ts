import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { FormprovedoresComponent } from '../formprovedores/formprovedores.component';
import * as _ from 'lodash';
import { EmpresaService } from 'src/app/servicesComponents/empresa.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-formempresa',
  templateUrl: './formempresa.component.html',
  styleUrls: ['./formempresa.component.scss']
})
export class FormempresaComponent implements OnInit {
  
  data:any = {};
  id:any;
  titulo:string = "Lista";
  listEmpresa:any = [];
  dataUser:any = {};

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _empresa: EmpresaService,
    public dialogRef: MatDialogRef<FormprovedoresComponent>,
    private _store: Store<STORAGES>,
    @Inject(MAT_DIALOG_DATA) public datas: any
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.getListEmpresa();
  }

  getListEmpresa(){
    this._empresa.get( { } ).subscribe(( res:any )=>{
      this.listEmpresa = res.data;
    });
  }

  checkiando( item ){
    for( let row of this.listEmpresa )row.check = false;
    item.check = !item.check;
  }

  newDato(){
    this.listEmpresa.unshift({ check: true});
  }

  submit(){
    let filtro = this.listEmpresa.find(( key:any )=> key.check == true );
    this.dialogRef.close( filtro );
  }
  guardar( item:any ){
    this._empresa.create( {
      empresa: item.empresa,
      usuario: this.dataUser.id
    }).subscribe( ( res:any ) => {
      item.id = res.id;
      item.check = true;
    } );
  }
  updates( item:any ){
    this._empresa.update( {
      empresa: item.empresa,
      usuario: this.dataUser.id
    }).subscribe( ( res:any ) => {} );
  }
}
