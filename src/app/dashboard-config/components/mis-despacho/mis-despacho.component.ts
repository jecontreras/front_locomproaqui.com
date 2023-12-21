import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { FormventasComponent } from '../../form/formventas/formventas.component';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as moment from 'moment';
import { FormcrearguiaComponent } from '../../form/formcrearguia/formcrearguia.component';

@Component({
  selector: 'app-mis-despacho',
  templateUrl: './mis-despacho.component.html',
  styleUrls: ['./mis-despacho.component.scss']
})
export class MisDespachoComponent implements OnInit {

  dataTable: DataTable;
  dataTable2: DataTable;
  dataTable3: DataTable;
  dataTable4: DataTable;
  dataTable5: DataTable;

  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{

    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Acciónes','Foto','Producto','Numero Guia', 'Estado Venta', 'Cantidad', 'Dinero','Plataforma',"Dinero Proveedor", 'Talla', 'Color', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;
  opcionCurrencys:any;
  reacudo:number;
  Pdreacudo:number;
  Pcreacudo:number;
  counts:number = 0;
  counts2:number = 0;
  querysSale:any = {
    where:{
    },
    limit: 10,
    skip: 0
  }

  querysComplete:any = {
    where:{
    },
    limit: 10,
    skip: 0
  };
  filtro:any = {
    dateStart: moment().format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD')
  };
  dataCache=[];

  constructor(
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _usuarios: UsuariosService,
    private _venta: VentasService,
  ) {
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
        this.querysSale.where.creacion = this.dataUser.id;
        this.querysComplete.where.creacion = this.dataUser.id;
      } catch (error) {}
    });
  }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable2 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable3 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable4 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable5 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
    this.cargarTodos2();
    this.cargarTodos3();
    this.cargarTodos4();
    this.cargarTodos5();
    //this.getDineros();
  }



  /*getDineros(){
    this._usuarios.getRecaudo( { where: { usuario: this.dataUser.id } } )
    .subscribe( (res: any ) => {
      try {
        this.reacudo = res.data[0].valor;
      } catch (error) {
        this.reacudo = 0;
      }
    });
  }*/

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
   }

   pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }
  pageEvent2(ev: any) {
    this.querysSale.page = ev.pageIndex;
    this.querysSale.limit = ev.pageSize;
    this.cargarTodos2();
  }
  pageEvent3(ev: any) {
    this.querysComplete.page = ev.pageIndex;
    this.querysComplete.limit = ev.pageSize;
    this.cargarTodos2();
  }
  pageEvent4(ev: any) {
    this.querysComplete.page = ev.pageIndex;
    this.querysComplete.limit = ev.pageSize;
    this.cargarTodos4();
  }
  pageEvent5(ev: any) {
    this.querysComplete.page = ev.pageIndex;
    this.querysComplete.limit = ev.pageSize;
    this.cargarTodos5();
  }
  cargarTodos5() {
    this.spinner.show();
    this._productos.getVentaDevolution( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable5.headerRow = this.dataTable5.headerRow;
      this.dataTable5.footerRow = this.dataTable5.footerRow;
      this.dataTable5.dataRows.push(... res.data);
      this.dataTable5.dataRows =_.unionBy(this.dataTable5.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }
  cargarTodos4() {
    this.spinner.show();
    this._productos.getVentaCompletePendients( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable4.headerRow = this.dataTable4.headerRow;
      this.dataTable4.footerRow = this.dataTable4.footerRow;
      this.dataTable4.dataRows.push(... res.data);
      this.dataTable4.dataRows =_.unionBy(this.dataTable4.dataRows || [], res.data, 'id');
      this.dataCache = this.dataTable4.dataRows;
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarTodos3() {
    this.spinner.show();
    this._productos.getVentaCompleteComplete( this.querysComplete ).subscribe(res=>{
      //console.log("****55", res)
      this.counts2 = res.count;
      this.Pcreacudo = res.total;
      this.dataTable3.headerRow = this.dataTable3.headerRow;
      this.dataTable3.footerRow = this.dataTable3.footerRow;
      this.dataTable3.dataRows.push(... res.data);
      this.dataTable3.dataRows =_.unionBy(this.dataTable3.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }
  cargarTodos2() {
    this.spinner.show();
    this._productos.getVentaCompleteEarring( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable2.headerRow = this.dataTable2.headerRow;
      this.dataTable2.footerRow = this.dataTable2.footerRow;
      this.dataTable2.dataRows.push(... res.data);
      this.dataTable2.dataRows =_.unionBy(this.dataTable2.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarTodos() {
    this.spinner.show();
    this._productos.getVentaComplete( this.querysSale ).subscribe(res=>{
      //console.log("****55", res)
      this.counts = res.count;
      this.reacudo = res.total;
      this.dataTable.headerRow = this.dataTable.headerRow;
      this.dataTable.footerRow = this.dataTable.footerRow;
      this.dataTable.dataRows.push(... res.data);
      this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
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
      where:{},
      limit: 10
    };
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          colorSelect: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          titulo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
    this.cargarTodos2();
    this.cargarTodos3();
  }

  filterDate(){
    /*this.querysSale.where.createdAt = {
      ">=": moment( this.filtro.dateStart ).format("YYYY-MM-DD"),
      "<=": moment( this.filtro.dateEnd ).format("YYYY-MM-DD"),
    };
    this.querysSale.limit = 10;
    this.querysSale.page = 0;
    this.dataTable4.dataRows = [];
    this.cargarTodos4();*/
    this.dataTable4.dataRows = this.dataCache.filter( item => 
      item.createdAt >=moment( this.filtro.dateStart ).format("YYYY-MM-DD") &&
      item.createdAt <=moment( this.filtro.dateEnd ).format("YYYY-MM-DD")
    );
  }

  async handleOpenShop( obj:any ){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: { datos: await this.getVentaId( obj.ventas.id ) || {} }
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      //console.log(`Dialog result: ${result}`);
      if(result == 'creo') this.cargarTodos();
      if( obj.id ) {
        let filtro:any = await this.getDetallado( obj.id );
          if( !filtro ) return false;
          let idx = _.findIndex( this.dataTable4.dataRows, [ 'id', obj.id ] );
          //console.log("**",idx)
          if( idx >= 0 ) {
            console.log("**",this.dataTable4['dataRows'][idx], filtro)
            this.dataTable4['dataRows'][idx]['ventas']['ven_estado'] = filtro['ventas']['ven_estado'];
            this.dataTable4['dataRows'][idx]['ventas']['ven_numero_guia'] = filtro['ventas']['ven_numero_guia'];
          }
      }
    });
  }

  handleCreateGuide(row){
    let data = row.ventas;
    //data.articulo = this.listCarrito;
    const dialogRef = this.dialog.open( FormcrearguiaComponent,{
      data: { datos: data.ventas || {} }
    } );

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      if( !result ) return false;
      data.ven_numero_guia = result.nRemesa;
      data.ven_imagen_guia = result.urlRotulos;
      if( data.transportadoraSelect === "CORDINADORA") this.imprimirGuia( data );
      if( data.transportadoraSelect === "ENVIA") this.viewRotulo( data.ven_imagen_guia );
      if( data.transportadoraSelect === "TCC") this.imprimirGuia( data );
      data.ven_estado = 3;
      this.handleUpdateGuide( data );
    });
  }

  imprimirGuia( data ){
    if( data.transportadoraSelect == "ENVIA" || data.transportadoraSelect == "TCC") {
      if( data.ven_imagen_guia ) window.open( data.ven_imagen_guia );
      else{
        this._venta.getFletes( {  where: {  nRemesa: data.ven_numero_guia } } ).subscribe( ( res:any ) =>{
          res = res.data[0];
          if( !res ) return this._tools.tooast("Error al imprimir la guia por favor comunicarse con el servicio al cliente")
          window.open( res.urlRotulos );
        });
      }
    }
    if( data.transportadoraSelect == "CORDINADORA" || data.transportadoraSelect == "INTERRAPIDISIMO"){
      this._venta.imprimirFlete( {
        codigo_remision: data.ven_numero_guia,
        transportadoraSelect: data.transportadoraSelect
      }).subscribe(( res:any ) =>{
        this._tools.downloadPdf( res.data, data.ven_numero_guia );
      })
    }
  }

  viewRotulo( urlRotulos ){
    this._tools.seguridadIfrane( urlRotulos );
  }

  handleUpdateGuide( data ){
    this._venta.update( data ).subscribe((res: any) => {

    });
  }

  async getVentaId( id:any ){
    return new Promise( resolve => {
      this._venta.get( { where: { id: id } } ).subscribe(( res:any )=>{
        res = res.data[0];
        resolve( res || false )
      },()=> resolve( false ) );
    })
  }

  async getDetallado( id:any ){
    return new Promise( resolve => {
      this._productos.getVenta( { where: { id: id } } ).subscribe(( res:any )=>{
        res = res.data[0];
        resolve( res || false )
      },()=> resolve( false ) );
    })
  }

}
