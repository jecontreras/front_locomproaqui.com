import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { Fruit } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-form-list-size',
  templateUrl: './form-list-size.component.html',
  styleUrls: ['./form-list-size.component.scss']
})
export class FormListSizeComponent implements OnInit {

  data:any = {
    tit_sw_activo: 1
  };
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";

  listTipoTalla:any = [];
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    public dialog: MatDialog,
    private _tipoTalla: TipoTallasService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormListSizeComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      this.getTipeSize();
    }else{this.id = ""}
  }

  getTipeSize(){
    this._tipoTalla.getTalla( { where: { tal_tipo: this.id, tal_sw_activo: 0 }, limit: 1000 } ).subscribe((res:any)=>{
      this.listTipoTalla =_.map( res.data , ( row )=>{
        return {
          ... row,
          id: row.id,
          tal_descripcion: Number( row.tal_descripcion ) || String( row.tal_descripcion )
        };
      });
      //this.listTipoTalla = _.orderBy( this.listTipoTalla, ['tal_descripcion'], ['asc'] );
      //console.log( this.listTipoTalla, res )
    }, error=> this._tools.presentToast("error servidor"));
  }

  async submit(){
    console.log(this.data.cat_activo)
    // if(this.data.cat_activo) this.data.cat_activo = 0;
    // else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { await this.guardar(); }
    this.submitHijos();
  }

  guardar( item:any = this.data ){
    return new Promise( resolve =>{
      this._tipoTalla.create( item ).subscribe((res:any)=>{
        //console.log(res);
        this.data.id = res.id;
        this._tools.presentToast("Exitoso");
        resolve( res );
      }, (error)=>{ this._tools.presentToast("Error"); resolve( false ); });
    });
  }

  updates( item:any = this.data ){
    item = _.omit(item, [ 'cat_usu_actualiz' ])
    item = _.omitBy(item, _.isNull);
    this._tipoTalla.update( item ).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

  async submitHijos(){
    if( !this.data.id ) return false;
    for ( let row of this.listTipoTalla ){
      let data:any = {
        id: row.id || null,
        tal_descripcion: row.tal_descripcion,
        tal_sw_activo: 0,
        tal_tipo: this.data.id
      };
      data = _.omitBy( data, _.isNull);
      if( row.id ) { }
      else  await this.guardarTalla( data );
    }
  }

  guardarTalla( item:any = this.data ){
    return new Promise( resolve =>{
      this._tipoTalla.createTallas( item ).subscribe((res:any)=>{
        //console.log(res);
        //this.data.id = res.id;
        this._tools.presentToast("Exitoso");
        resolve( res );
      }, (error)=>{ this._tools.presentToast("Error"); resolve( false ); });
    });
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    const input = event.input;
    let filtro = this.listTipoTalla.filter(( item:any ) => item.tal_descripcion == value );
    if( filtro ) if( filtro.length > 0 ) return false;
    if (value) {
      let data:any = {
        tal_descripcion: value,
      };
      this.listTipoTalla.push( data );
    }
    //console.log( "***127", event.input )
    event.value = "";
    // Limpiar el input
    if (input) {
      input.value = '';
    }
    // Clear the input value
    try {
      event['chipInput']!.clear();
      event.input.value = "";
    } catch (error) {

    }
    //if( this.id )  this.submitHijos();
  }

  async remove(item: Fruit) {
    const index = this.listTipoTalla.indexOf( item );

    if ( index >= 0 ) {
      let data:any = this.listTipoTalla[ index ];
      if( data.id ){
        let result = await this.eliminarTipeSize( item );
        if( result ) this.listTipoTalla.splice(index, 1);
      }else this.listTipoTalla.splice(index, 1);
    }
  }

  async eliminarTipeSize( item:any ){
    return new Promise(resolve =>{
      let data = {
        id: item.id,
        tal_sw_activo: 0
      }
      this._tipoTalla.updateTalla( data ).subscribe(( res:any )=>{
        this._tools.tooast( { title: "Eliminado" });
        resolve( true );
      },()=> { this._tools.tooast( { title: "Error de servidor", icon:"error" } ); resolve( false ); } );
    });
  }

  async handleOrdenate( item ){
    return new Promise(resolve =>{
      if( !item.id ) return resolve( false );
      let data = {
        id: item.id,
        ordenar: item.ordenar
      };
      this._tipoTalla.updateTalla( data ).subscribe(( res:any )=>{
        this._tools.tooast( { title: "Eliminado" });
        resolve( true );
      },()=> { this._tools.tooast( { title: "Error de servidor", icon:"error" } ); resolve( false ); } );
    });
  }

}
