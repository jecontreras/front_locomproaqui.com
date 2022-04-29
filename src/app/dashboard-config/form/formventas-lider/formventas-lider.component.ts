import { Component, OnInit, Inject } from '@angular/core';
import { FormventasComponent } from '../../form/formventas/formventas.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { FormpuntosComponent } from '../../form/formpuntos/formpuntos.component';
import * as moment from 'moment';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service'
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/servicesComponents/empresa.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-formventas-lider',
  templateUrl: './formventas-lider.component.html',
  styleUrls: ['./formventas-lider.component.scss']
})
export class FormventasLiderComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query: any = {
    where: {
      ven_sw_eliminado: 0,
      ven_estado: { '!=': 4 }
    },
    page: 0
  };
  Header:any = [ 'Acciones','Numero Guia','Vendedor','Nombre Cliente','Teléfono Cliente','Ganancia Vendedor', 'Valor de flete', 'Fecha Venta','Estado', 'Pagado', 'Ganancia'];
  $: any;
  public datoBusqueda = '';

  notscrolly: boolean = true;
  notEmptyPost: boolean = true;
  dataUser: any = {};
  activando: boolean = false;
  filtro: any = {};
  count:Number = 0;

  constructor(
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private _store: Store<STORAGES>,
    private _user: UsuariosService,
    private Router: Router,
    private _empresa: EmpresaService,
    public dialogRef: MatDialogRef<FormventasLiderComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      this.activando = false;
      if (this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
      if (this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.activando = true;
    });
  }

  ngOnInit() {
    if (Object.keys(this.datas).length > 0) {
      // console.log(this.datas);
      if( !this.datas.empresa ) this.dialog.closeAll();
    }
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.borrarFiltro();
  }

  getUserCabeza() {
    if (!this.datas.empresa) return false;
    delete this.query.where.usu_clave_int;
    this.query.where.ven_empresa = this.datas.empresa.id;
    this.cargarTodos();
    /*this._empresa.get({ where: { id: this.datas.empresa.id } }).subscribe((res: any) => {
      res = res.data[0];
      if (!res) return false;
      this._user.get({ where: { empresa: res.id } }).subscribe((res: any) => {
        res = res.data;
        if (res.length > 0) this.query.where.usu_clave_int = _.map(res, 'id');
        else this.query.where.usu_clave_int = [];
        this.query.where.usu_clave_int.push(this.datas.id);
        this.cargarTodos();
      });
    });*/
  }

  verTable() {
    this.Router.navigate(['/config/tablaventas'])
  }

  crear(obj: any) {
    const dialogRef = this.dialog.open(FormventasComponent, {
      data: { datos: obj || {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  pageEvent(ev:any){
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  cargarTodos() {
    this._ventas.get(this.query)
      .subscribe(
        (response: any) => {
          this.dataTable.headerRow = this.dataTable.headerRow;
          this.dataTable.footerRow = this.dataTable.footerRow;
          this.dataTable.dataRows.push(...response.data)
          this.dataTable.dataRows = _.unionBy(this.dataTable.dataRows || [], this.dataTable.dataRows, 'id');
          this.loader = false;
          this.count = response.count || 3000;
          if (response.data.length === 0) {
            this.notEmptyPost = false;
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
    this.query = {
      where: {
        ven_sw_eliminado: 0,
        ven_estado: { '!=': 4 }
      },
      page: 0
    };
    if (this.datoBusqueda !== '') {
      this.query.where.or = [
        {
          ven_nombre_cliente: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          ven_usu_creacion: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          ven_telefono_cliente: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          ven_direccion_cliente: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          ven_numero_guia: {
            contains: this.datoBusqueda || ''
          }
        },
      ];
    }
    if (this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
    if (this.dataUser.usu_perfil.prf_descripcion == "subAdministrador") this.getUserCabeza();
    else this.cargarTodos();
  }

  buscarEstado() {
    this.loader = false;
    this.notscrolly = true
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];

    this.query.page = 0;
    if (Number(this.filtro.ven_estado) == 5) { this.query.where.ven_estado = { '!=': 4 }; }
    else this.query.where.ven_estado = Number(this.filtro.ven_estado);
    this.cargarTodos();
  }

  validandoFecha() {
    var dateFormat = 'YYYY-MM-DD';
    if (!(moment(moment(this.filtro.fechaInicio).format(dateFormat), dateFormat).isValid())) return false;
    if (!(moment(moment(this.filtro.fechaFinal).format(dateFormat), dateFormat).isValid())) return false;

    this.loader = false;
    this.notscrolly = true
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];

    this.query.page = 0;
    this.query.where.createdAt = {
      ">=": moment(this.filtro.fechaInicio),
      "<=": moment(this.filtro.fechaFinal)
    };
    this.cargarTodos();

  }

  borrarFiltro() {
    this.filtro = {
      fechaInicio: moment().format("YYYY-MM-DD"),
      fechaFinal: moment().add(30, 'days').format("YYY-MM-DD")
    };
    this.datoBusqueda = "";
    this.query = {
      where: {
        ven_sw_eliminado: 0,
        ven_estado: { '!=': 4 }
      },
      page: 0
    };
    this.getUserCabeza();
  }

  openUrl( numero:any, cliente:string, obj:any ){
    let Url:string = `https://wa.me/57${ numero }?text=Hola Cliente ${ cliente } Este esta es tu guia --> ${ obj.ven_numero_guia } <-- Transportadora Envia >>>>>> url: ' ${ obj.ven_imagen_guia }' <<<<<<`;
    console.log(Url, obj)
    window.open( Url );
  }

  openFoto( foto: string ){
    window.open( foto );
  }

  verDetalles( url:string ){
    window.open( "https://enviosrrapidoscom.web.app/portada/guiadetalles/" + url )
  }

  openEvidencia( url:string ){
    window.open( url )
  }

  btndelete(obj:any, idx:any){
    let data:any = {
      id: obj.id,
      ven_estado: 1,
      ven_sw_eliminado: 1
    };
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      if(opt.value){
        if( obj.ven_estado == 1 || obj.ven_estado == 2 || obj.ven_estado == 3 || obj.ven_estado == 4 ) { this._tools.presentToast("Error no puedes Eliminar esta venta por tener datos de despachado"); return false; }
        this._ventas.update(data).subscribe((res:any)=>{
          this.dataTable.dataRows.splice(idx, 1);
          this._tools.presentToast("Eliminado")
        },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
      }
    });
  }

}