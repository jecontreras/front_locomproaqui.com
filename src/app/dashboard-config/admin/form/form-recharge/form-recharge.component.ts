import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { RechargeService } from 'src/app/servicesComponents/recharge.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-recharge',
  templateUrl: './form-recharge.component.html',
  styleUrls: ['./form-recharge.component.scss']
})
export class FormRechargeComponent implements OnInit {
  data:any = {};
  formatoMoneda:any = {};
  id:any;
  titulo:string;
  files: File[] = [];

  constructor(
    private _tools: ToolsService,
    private _recharge: RechargeService,
    private _archivos: ArchivosService,
    public dialogRef: MatDialogRef<FormRechargeComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) { }

  ngOnInit(): void {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
    }
    this.formatoMoneda = this._tools.currency;
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  async subirFile(){
    return new Promise( resolve =>{
      let form:any = new FormData();
      form.append('file', this.files[0]);
      this._tools.ProcessTime({});
      this._archivos.create(form).subscribe((res:any)=>{
        //console.log(res);
        this.data.foto = res.files;//URL+`/${res}`;
        this._tools.presentToast("Exitoso");
        if(this.id)this.submit();
        this.files = [];
        resolve( true );
      },(error)=>{console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    });

  }


  async submit(){
    if( this.id ) this.handleUpdate();
    else {
      if( this.files.length === 0 ) return this._tools.error( { mensaje: "Por Favor subir foto"} )
      if( !this.data.foto && this.files.length )  await this.subirFile();
      this.handleCreate();
    }
    this.dialogRef.close('creo');
  }

  handleCreate(){
    return new Promise( resolve =>{
      this._recharge.create( this.data ).subscribe( res=>{
        this._tools.presentToast( "Create ");
        resolve( res );
      },()=>{ this._tools.presentToast("Error"); resolve( false ); });
    });
  }

  handleUpdate(){
    return new Promise( resolve =>{
      this._recharge.update( this.data ).subscribe( res=>{
        this._tools.presentToast( "update ");
        resolve( res );
      },()=>{ this._tools.presentToast("Error"); resolve( false ); });
    });
  }

}
