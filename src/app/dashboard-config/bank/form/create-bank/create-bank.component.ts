import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { ToolsService } from 'src/app/services/tools.service';
import { FormcategoriasComponent } from 'src/app/dashboard-config/form/formcategorias/formcategorias.component';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { Fruit } from 'src/app/interfaces/interfaces';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {

  data:any = {
    state: 0,
    accounType: 0
  };
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";

  listCategoria:any = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  dataUser:any = {};

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    public dialog: MatDialog,
    private _banco: BancosService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcategoriasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      this.getCategorias();
    }else{this.id = ""}
  }
  
  getCategorias(){
    this._banco.get( { where: { cat_activo: 0, cat_padre: this.data.id }, limit: 1000 } ).subscribe((res:any)=>{
      this.listCategoria =_.map( res.data , ( row )=>{ 
        return {
          id: row.id,
          categoria: row.cat_nombre,
          ... row
        };
      });
      console.log( this.listCategoria, res )
    }, error=> this._tools.presentToast("error servidor"));
  }

  submit(){
    console.log(this.data.cat_activo)
    // if(this.data.cat_activo) this.data.cat_activo = 0;
    // else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar( item:any = this.data ){
    let validate = this.validate();
    if( !validate ) return false;
    this.data.accounType = Number( this.data.accounType );
    this.data.user = this.dataUser.id;
    this._banco.create( item ).subscribe((res:any)=>{
      //console.log(res);
      this.data.id = res.id;
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
  }

  validate(){
    if( !this.data.bank ) { this._tools.tooast( { title: "Error falta la El nombre de la tarjeta del banco", icon: "error" } ); return false; }
    if( !this.data.numeroCuenta ) { this._tools.tooast( { title: "Error falta el numero de cuenta", icon: "error" } ); return false; }
    if( !this.data.numberCC ) { this._tools.tooast( { title: "Error falta la cedula del cliente", icon: "error" } ); return false; }
    if( !this.data.nameHeadline ) { this._tools.tooast( { title: "Error falta el nombre titular", icon: "error" } ); return false; }
    if( !this.data.numberPhone ) { this._tools.tooast( { title: "Error falta el numero de celular", icon: "error" } ); return false; }
    return true;
  }

  updates( item:any = this.data ){
    this._banco.update( item ).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
