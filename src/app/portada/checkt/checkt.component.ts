import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { CART } from 'src/app/interfaces/sotarage';
import { departamento } from 'src/app/JSON/departamentos';
import { CartAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-checkt',
  templateUrl: './checkt.component.html',
  styleUrls: ['./checkt.component.scss']
})
export class ChecktComponent implements OnInit {
  
  data:any = {};
  listCiudad:any = departamento || [];
  listCarrito:any = [];
  totalSuma:number = 0;
  vista = 'inicial';
  valor:boolean = true;
  disabled:boolean = false;
  vista1:string = "inicial";

  constructor(
    private _store: Store<CART>,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private _router: Router
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.listCarrito = store.cart || [];
      this.suma();
    });
  }

  ngOnInit(): void {
    if( this.listCarrito.length == 0 ) this._router.navigate(['/tienda/productos']);
  }

  suma(){
    for( let row of this.listCarrito ) this.totalSuma+= row.costoTotal
  }

  borrar( idx:any, item:any ){
    this.listCarrito.splice(idx, 1);
    let accion = new CartAction(item, 'delete');
    this._store.dispatch(accion);
  }
  validadornext(){
    if( !this.data.nombre ) return this._tools.tooast({ title: "Error Por Favor Completar campos nombre", icon: "error" });
    if( !this.data.telefono ) return this._tools.tooast({ title: "Error Por Favor Completar campos telefono", icon: "error" });
    if( !this.data.ciudad ) return this._tools.tooast({ title: "Error Por Favor Completar campos ciudad", icon: "error" });
    if( !this.data.barrio ) return this._tools.tooast({ title: "Error Por Favor Completar campos barrio", icon: "error" });
    if( !this.data.direccion ) return this._tools.tooast({ title: "Error Por Favor Completar campos direccion", icon: "error" });
    if( !this.data.apartamento ) return this._tools.tooast({ title: "Error Por Favor Completar campos apartamento", icon: "error" });
    if( !this.data.departamento ) return this._tools.tooast({ title: "Error Por Favor Completar campos departamento", icon: "error" });
    this.vista = "segunda";
  }

  async finalizando(){
    if( this.disabled ) return false;
    this.disabled = true;
    for( let row of this.listCarrito ){
      let data:any = {
        "ven_tipo": "whatsapp",
        "usu_clave_int": 1,
        "ven_usu_creacion": "joseeduar147@gmail.com",
        "ven_fecha_venta": moment().format("DD/MM/YYYY"),
        "cob_num_cedula_cliente": "0",
        "ven_nombre_cliente": this.data.nombre,
        "ven_telefono_cliente": this.data.telefono,
        "ven_ciudad": this.data.ciudad,
        "ven_barrio": this.data.barrio,
        "ven_direccion_cliente": this.data.direccion,
        "ven_cantidad": row.cantidad,
        "ven_tallas": "0",
        "ven_precio": row.costo,
        "ven_total": row.costoTotal,
        "ven_ganancias": 0,
        "prv_observacion": "ok",
        "ven_estado": 0,
        "create": moment().format("DD/MM/YYYY"),
        "apartamento": this.data.apartamento,
        "departamento": this.data.departamento,
        "ven_imagen_producto": row.foto
      };
      await this.nexCompra( data );
    }
    this.disabled = false;
    this._tools.presentToast("Exitoso Tu pedido esta en proceso. un accesor se pondra en contacto contigo!");
    this.vista1 = "segunda";
    this.data = {};
    this.listCarrito = [];
    let accion = new CartAction( { }, 'drop');
    this._store.dispatch( accion );
  }

  async nexCompra( data:any ){
    return new Promise( resolve =>{
      this._ventas.create( data ).subscribe(( res:any )=>{
        resolve( true );
      },( error:any )=> {
        //this._tools.presentToast("Error de servidor")
        resolve( false );
      });
    })
  }
}
