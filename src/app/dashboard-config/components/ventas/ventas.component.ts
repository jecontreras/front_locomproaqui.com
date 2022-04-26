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
import * as moment from 'moment'; 
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service'
import { VentastableComponent } from '../../table/ventastable/ventastable.component';
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
      ven_estado: { '!=': 4 },
      ven_retiro: null
    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Acciones','Tipo Venta','Vendedor','Nombre Cliente','Teléfono Cliente','Fecha Venta','Estado', 'Pagado', 'Ganancia', 'Motivo Rechazo' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  activando:boolean = false;
  filtro:any = {};
  dataInfo:any ={};
  listVendedores:any = [];
  keyword = 'usu_usuario';

  constructor(
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _user: UsuariosService,
    private Router: Router,
    private _empresa: EmpresaService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      this.activando = false;
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.activando = true;
    });
    if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
    //if(this.dataUser.usu_perfil.prf_descripcion != 'subAdministrador') this.getUserCabeza();
   }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.borrarFiltro();
    this.getVendedores();
  }

  getVendedores(){
    this._user.getOn( { where: { }, limit: 10000 } ).subscribe( ( res:any )=>{
      this.listVendedores = res.data;
    } );
  }

  getUserCabeza(){
    console.log( this.dataUser)
    if( !this.dataUser.empresa ) return false;
    delete this.query.where.usu_clave_int;
    this.query.where.ven_empresa = this.dataUser.empresa.id;
    this.cargarTodos();
    /*this._empresa.get( { where: {id: this.dataUser.empresa.id  } } ).subscribe(( res:any )=>{
      res = res.data[0];
      if( !res ) return false;
      this._user.get({ where: { empresa: res.id } }).subscribe((res:any)=>{
        res = res.data;
        if( res.length > 0 ) this.query.where.usu_clave_int = _.map(res, 'id');
        else this.query.where.usu_clave_int = [];
        this.query.where.usu_clave_int.push( this.dataUser.id );
        this.cargarTodos();
      });
    });*/
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      console.log(`Dialog result: ${result}`);
      if(result == 'creo') this.cargarTodos();
      if( obj.id ) {
        let filtro:any = await this.getDetallado( obj.id );
          if( !filtro ) return false;
          let idx = _.findIndex( this.dataTable.dataRows, [ 'id', obj.id ] );
          console.log("**",idx)
          if( idx >= 0 ) { 
            console.log("**",this.dataTable['dataRows'][idx], filtro)
            this.dataTable['dataRows'][idx] = { ven_estado: filtro.ven_estado, ...filtro}; 
          }
      }
    });
  }

  async getDetallado( id:any ){
    return new Promise( resolve => {
      this._ventas.get( { where: { id: id } } ).subscribe(( res:any )=>{
        res = res.data[0];
        resolve( res || false )
      },()=> resolve( false ) );
    })
  }

  verTable(){
    this.Router.navigate(['/config/tablaventas'])
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
      ven_estado: 1,
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
    if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.query.where.ven_subVendedor = 0;
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
    this.query = {
      where:{
        ven_sw_eliminado: 0,
        ven_estado: { '!=': 4 },
        ven_retiro: null
      },
      page: 0,
      limit: 10
    };
    if (this.datoBusqueda !== '') {
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
          ven_numero_guia: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
    }
    if( this.filtro.vendedor ) { 
      console.log( this.filtro )
      this.query.where.usu_clave_int = this.filtro.vendedor.id;
      this.getValorVenta();
    }
    if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
    if(this.dataUser.usu_perfil.prf_descripcion == "subAdministrador") this.getUserCabeza();
    else this.cargarTodos();
  }

  getValorVenta(){
    let filtro: any = { where:{ user: this.query.where.usu_clave_int, estado: this.query.where.ven_estado } };
    console.log( filtro );
    this._ventas.getMontos( filtro ).subscribe((res:any)=>this.dataInfo = res.data);
  }

  buscarEstado(){
    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];

    this.query.page =  0;
    console.log( "**", this.filtro.ven_estado )
    if( Number( this.filtro.ven_estado ) == 5 ) { this.query.where.ven_estado = { '!=': 4 }; this.query.where.ven_retiro = null; }
    if( Number( this.filtro.ven_estado ) == 6 ) { this.query.where.ven_estado = { '!=': 4 }; this.query.where.ven_retiro = { '!=': null }; }
    else this.query.where.ven_estado = Number( this.filtro.ven_estado );

    if( this.filtro.vendedor ) { 
      this.query.where.usu_clave_int = this.filtro.vendedor.id;
      this.getValorVenta();
    }

    this.cargarTodos();
  }

  validandoFecha(){
    var dateFormat = 'YYYY-MM-DD';
    if( !( moment(moment( this.filtro.fechaInicio ).format(dateFormat),dateFormat ).isValid() ) ) return false;
    if( !( moment(moment( this.filtro.fechaFinal ).format(dateFormat),dateFormat ).isValid() ) ) return false;

    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.dataTable.dataRows = [];

    this.query.page =  0;
    this.query.where.createdAt = {
      ">=": moment( this.filtro.fechaInicio ),
      "<=": moment( this.filtro.fechaFinal )
    };
    this.cargarTodos();

  }

  borrarFiltro(){
    this.filtro = {
      fechaInicio: moment().format("YYYY-MM-DD"),
      fechaFinal: moment().add(-30, 'days').format("YYYY-MM-DD")
    };
    this.datoBusqueda = "";
    this.query= {
      where: {
        ven_sw_eliminado: 0,
        ven_estado: { '!=': 4 },
        ven_retiro: null
      },
      page: 0,
      limit: 10
    };
    if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;

    if(this.dataUser.usu_perfil.prf_descripcion == "subAdministrador") this.getUserCabeza();
    else this.cargarTodos();
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

}