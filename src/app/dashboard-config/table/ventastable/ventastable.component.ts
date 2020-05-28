import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { EmpresaService } from 'src/app/servicesComponents/empresa.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';


class DataTablesResponse {
  data: any[];
  count: number;
  status: number;
  recordsFiltered: number;
}

@Component({
  selector: 'app-ventastable',
  templateUrl: './ventastable.component.html',
  styleUrls: ['./ventastable.component.scss']
})
export class VentastableComponent implements OnInit {
  
  titulo:string;
  //dtOptions: DataTables.Settings = {};
  query:any = {
    where:{},
    limit: 30
  };

  dtTrigger: any = new Subject();
  settings = {
    columns: {
      ven_numero_guia:{
        title: 'Numero de Guia'
      },
      cob_num_cedula_cliente: {
        title: 'Cedula Cliente'
      },
      ven_barrio: {
        title: 'Barrio Cliente'
      },
      ven_ciudad: {
        title: 'Ciudad cliente'
      },
      ven_direccion_cliente: {
        title: 'Direccion Cliente'
      },
      ven_nombre_cliente: {
        title: 'Nombre Cliente'
      },
      ven_telefono_cliente: {
        title: 'Telefono cliente'
      },
      ven_tipo: {
        title: 'Tipo Venta'
      },
      ven_fecha_venta: {
        title: 'Fecha Venta'
      },
      ven_ganancias: {
        title: 'Ganancias Vendedor'
      },
      ven_tallas: {
        title: 'Talla'
      },
      ven_cantidad: {
        title: 'Cantidad'
      },
      ven_precio: {
        title: 'Precio'
      },
      ven_total: {
        title: 'Precio Total'
      },
      usu_nombre: {
        title: 'Nombre Vendedor'
      },
      usu_apellido: {
        title: 'Apellido Vendedor'
      },
      usu_email: {
        title: 'Email Vendedor'
      },
      usu_ciudad: {
        title: 'Ciudad Vendedor'
      },
      usu_direccion: {
        title: 'Direccion Vendedor'
      },
      usu_telefono: {
        title: 'Telefono Vendedor'
      },
      porcentaje: {
        title: 'Porcentaje Ganancias'
      },
    }
  };
  data = [];
  dataUser:any = {};

  constructor(
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _empresa: EmpresaService,
    private _user: UsuariosService
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    this.query= {
      where: {
        ven_sw_eliminado: 0,
        ven_estado: { '!=': 4 }
      },
      page: 0,
      limit: -1
    };
    if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
    if(this.dataUser.usu_perfil.prf_descripcion == "subAdministrador") this.getUserCabeza();
    else this.getRow();

    // this.getRow();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getUserCabeza(){
    if( !this.dataUser.empresa ) return false;
    delete this.query.where.usu_clave_int;
    this.query.where.ven_empresa = this.dataUser.empresa.id;
    this.getRow();
    /*this._empresa.get( { where: {id: this.dataUser.empresa.id  } } ).subscribe(( res:any )=>{
      res = res.data[0];
      if( !res ) return false;
      this._user.get({ where: { empresa: res.id } }).subscribe((res:any)=>{
        res = res.data;
        if( res.length > 0 ) this.query.where.usu_clave_int = _.map(res, 'id');
        else this.query.where.usu_clave_int = [];
        this.query.where.usu_clave_int.push( this.dataUser.id );
        this.getRow();
      });
    });*/
  }

  getRow(){
    this.spinner.show();
    if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.query.where.ven_subVendedor = 0;
    this._ventas.get(this.query).subscribe((res:DataTablesResponse)=>{
      this.data = _.map(res.data, (row:any)=>{
        return {
          ven_numero_guia: row.ven_numero_guia,
          cob_num_cedula_cliente: row.cob_num_cedula_cliente,
          ven_barrio: row.ven_barrio,
          ven_ciudad: row.ven_ciudad,
          ven_direccion_cliente: row.ven_direccion_cliente,
          ven_nombre_cliente: row.ven_nombre_cliente,
          ven_telefono_cliente: row.ven_telefono_cliente,
          ven_tipo: row.ven_tipo,
          ven_fecha_venta: row.ven_fecha_venta,
          ven_ganancias: row.ven_ganancias,
          ven_tallas: row.ven_tallas,
          ven_cantidad: row.ven_cantidad,
          ven_precio: row.ven_precio,
          ven_total: row.ven_total,
          usu_nombre: row.usu_clave_int?.usu_nombre,
          usu_apellido: row.usu_clave_int?.usu_apellido,
          usu_email: row.usu_clave_int?.usu_email,
          usu_ciudad: row.usu_clave_int?.usu_ciudad,
          usu_direccion: row.usu_clave_int?.usu_direccion,
          usu_telefono: row.usu_clave_int?.usu_telefono,
          porcentaje: row.usu_clave_int?.porcentaje
        };
      });
      this.spinner.hide();
    });
  }

}
