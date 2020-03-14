import { Component, OnInit } from '@angular/core';
import { FormventasComponent } from '../../form/formventas/formventas.component';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { FormpuntosComponent } from '../../form/formpuntos/formpuntos.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      ven_sw_eliminado: 0,
      ven_estado: { '!=': 4 }
    },
    page: 0
  };
  Header:any = [ 'Acciones','Tipo Venta','Vendedor','Nombre Cliente','Teléfono Cliente','Fecha Venta','Productos','Cantidad','Precio','Imagen Producto','Estado', 'Motivo Rechazo', 'Tallas' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  activando:boolean = false;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      this.activando = false;
      if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.activando = true;
    });
   }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  darPuntos(){
    const dialogRef = this.dialog.open(FormpuntosComponent,{
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  delete(obj:any, idx:any){
    let data:any = {
      id: obj.id,
      ven_sw_eliminado: 1
    };
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      if(opt.value){
        if(obj.ven_estado == 1) { this._tools.presentToast("Error no puedes ya Eliminar la venta ya esta aprobada"); return false; }
        this._ventas.update(data).subscribe((res:any)=>{
          this.dataTable.dataRows.splice(idx, 1);
          this._tools.presentToast("Eliminado")
        },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
      }
    });
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
  }

  cargarTodos() {
    this.spinner.show();
    this._ventas.get(this.query)
    .subscribe(
      (response: any) => {
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data)
        this.dataTable.dataRows = _.unionBy(this.dataTable.dataRows || [], this.dataTable.dataRows, 'id');
        this.loader = false;
          this.spinner.hide();
          
          if (response.data.length === 0 ) {
            this.notEmptyPost =  false;
          }
          this.notscrolly = true;
      },
      error => {
        console.log('Error', error);
      });
  }

  buscar() {
    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
      this.query = {
        where:{
          ven_sw_eliminado: 0,
          ven_estado: { '!=': 4 }
        },
        page: 0
      }
      if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
      this.cargarTodos();
    } else {
      this.query.where.or = [
        {
          ven_nombre_cliente: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          ven_usu_creacion: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          ven_telefono_cliente: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          ven_direccion_cliente: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          ven_fecha_venta: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          ven_tallas: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
      this.cargarTodos();
    }
  }

}