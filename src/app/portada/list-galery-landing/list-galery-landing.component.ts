import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-list-galery-landing',
  templateUrl: './list-galery-landing.component.html',
  styleUrls: ['./list-galery-landing.component.scss']
})
export class ListGaleryLandingComponent implements OnInit {
  listColor:any = [];
  listSelect: any = [];
  checkView:string = 'one';

  constructor(
    public dialogRef: MatDialogRef<ListGaleryLandingComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInit: any,
    private _tools: ToolsService
  ) { }

  ngOnInit(): void {
    console.log("*****", this.dataInit)
    this.listColor = this.dataInit.data;
  }

  handleEnd(){
    this.dialogRef.close( this.listSelect );
  }

  async handleProccesMount( item:any, row:any  ){
    console.log("**")
    let val:any = await this._tools.modalInputSelect( );
    if( val.cantidad  && val.talla ) this.listSelect.push( { ref: row.talla ,foto: item.foto, codigo: item.codigo, cantidad: Number(val.cantidad), talla: val.talla } );
    else{
      this._tools.presentToast( "Necesita seleccionar la cantidad o talla, es importante, por favor, selecciónela nuevamente." );
    }
  }

  handleView(){
    if( this.checkView === 'one' ) this.checkView = 'two';
    else this.checkView = 'one';
  }

  async handleDropPhoto( item:any ){
    let valid:any = await this._tools.confirm( { title: "Eliminar Foto", detalle:"item Destruir", confir: "Si"});
    if( !valid.value ) return false;
    this.listSelect = this.listSelect.filter( row => row.foto !== item.foto );
    this._tools.presentToast( "Foto quitada" );
  }

}
