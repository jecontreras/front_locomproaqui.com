import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfiguracionAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { AdminService } from 'src/app/servicesComponents/admin.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  data: any = {};

  constructor(
    private _admin: AdminService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.data = store.configuracion || {};
    }
    );
  }

  ngOnInit(): void {
  }

  guardar() {
    let data:any = {
      id: this.data.id,
      clInformacion: this.data.clInformacion,
      cdPedidos: this.data.cdPedidos,
      cdVentas: this.data.cdVentas,
      cdRetiros: this.data.cdRetiros
    };
    this._admin.update( data ).subscribe(( res:any )=>{
      let accion = new ConfiguracionAction( res, 'post' );
      this._store.dispatch( accion );
      this._tools.tooast( { title: "Actualizado..."} );
    },( )=> this._tools.tooast( { title: "Erro al actualizar", icon: "error" } ) );
  }

}
