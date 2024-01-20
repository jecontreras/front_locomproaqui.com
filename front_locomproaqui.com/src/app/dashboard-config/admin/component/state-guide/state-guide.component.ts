import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-state-guide',
  templateUrl: './state-guide.component.html',
  styleUrls: ['./state-guide.component.scss']
})
export class StateGuideComponent implements OnInit {

  listGuias:any = [];
  listSelect:any = [];

  constructor(
    private _ventas: VentasService,
    private _tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this._ventas.get( { where:
        {
          pagaPlataforma: 0,
          ven_estado: 1,
          ven_sw_eliminado: 0
        }
      } ).subscribe( res => {
      this.listGuias = res.data;
    });
  }

  handleSelectCheck(){
    for( let row of this.listGuias ){
      if( row.check === true ) {
        let filtro = this.listSelect.find( item => item.id === row.id );
        if( !filtro ) this.listSelect.push( row );
      }
      else{
        let filtro = _.findIndex(this.listSelect, ['id', row.id ]);
        if(filtro >= 0 ) this.listSelect.splice( filtro, 1 );
    }
  }
 }

 async handleupdate(){
  for( let row of this.listSelect ){
    let data = {
      id: row.id,
      pagaPlataforma: 1
    };
    await this.processNext( data )
  }
  this._tools.presentToast("Actualizado estao de guias Pagadas")
  this.listSelect = [];
  this.listGuias = [];
  this.getList();

 }

 processNext( data ){
  return new Promise( resolve =>{
    this._ventas.update( data ).subscribe((res: any) => {
      resolve( data );
    },( errr )=> resolve( false ) );
  });
 }

}
