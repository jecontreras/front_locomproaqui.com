import { Component, Input, OnInit } from '@angular/core';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { FormventasComponent } from 'src/app/dashboard-config/form/formventas/formventas.component';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { VentasProductosService } from 'src/app/servicesComponents/ventas-productos.service';
import { FormcrearguiaComponent } from 'src/app/dashboard-config/form/formcrearguia/formcrearguia.component';

@Component({
  selector: 'app-list-dispatch',
  templateUrl: './list-dispatch.component.html',
  styleUrls: ['./list-dispatch.component.scss']
})
export class ListDispatchComponent implements OnInit {
  @Input() dataTable: DataTable={
    headerRow: [],
    footerRow: [],
    dataRows: []
  };
  @Input() config = {
    view: 'crear'
  };
  @Input() Header;
  dataCache= [];
  filtro:any = {
    dateStart: moment().format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD')
  };
  listCarrito = []
  btnDisabled:boolean = false;
  loader = false;

  constructor(
    public _tools: ToolsService,
    public dialog: MatDialog,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
    private _venta: VentasService,
    private _ventasProducto: VentasProductosService
  ) { }

  ngOnInit(): void {
    this.dataTable.headerRow = this.Header;
    this.dataTable.footerRow = this.Header;

    // let interval = setInterval(()=>{
      try {
        if( this.dataTable){
          this.dataCache = _.clone( this.dataTable.dataRows )
          // console.log("dev this.dataTable.dataRows", this.dataCache)
        }
       // if( this.dataCache.length ) clearInterval( interval );
      } catch (error) { }
    // }, 3000 );
  }
  datoBusqueda:string;

  buscar( ) {
    this.datoBusqueda = this._tools.limpiarString( this.datoBusqueda );
    if( this.datoBusqueda ){
      this.dataTable.dataRows = this.dataCache.filter( item=>{
          return item.colorSelect === this.datoBusqueda ||
          item.titulo === this.datoBusqueda ||
          this._tools.limpiarString( item.ventas.slug ) === this.datoBusqueda ||
          item.ventas.transportadoraSelect === this.datoBusqueda ||
          item.ventas.ven_numero_guia === this.datoBusqueda ||
          item.ventas.ven_telefono_cliente === this.datoBusqueda
        }
      );if( this.dataTable.dataRows.length === 0 ) {
        this.dataTable.dataRows = this._tools.buscarConPalabraClave( this.dataCache, this.datoBusqueda );
      }
    }else this.dataTable.dataRows = this.dataCache;
  }

  filterDate( ){
    this.dataTable.dataRows = this.dataCache.filter( item =>
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
      //if(result == 'creo') this.cargarTodos();
      if( obj.id ) {
        let filtro:any = await this.getDetallado( obj.id );
          if( !filtro ) return false;
          let idx = _.findIndex( this.dataTable.dataRows, [ 'id', obj.id ] );
          //console.log("**",idx)
          if( idx >= 0 ) {
            // console.log("**",this.dataTable['dataRows'][idx], filtro)
            this.dataTable['dataRows'][idx]['ventas']['ven_estado'] = filtro['ventas']['ven_estado'];
            this.dataTable['dataRows'][idx]['ventas']['ven_numero_guia'] = filtro['ventas']['ven_numero_guia'];
          }
      }
    });
  }

  async handleCreateGuide(row){
    return new Promise( async ( resolve ) =>{
      let data = row.ventas;
      await this.getArticulos( data.id );
      data.articulo = this.listCarrito;
      const dialogRef = this.dialog.open( FormcrearguiaComponent,{
        data: { datos: data || {} }
      } );

      dialogRef.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${result}`);
        if( !result ) return resolve( false );
        data.ven_numero_guia = result.nRemesa;
        data.ven_imagen_guia = result.urlRotulos;
        if( data.transportadoraSelect === "CORDINADORA") this.imprimirGuia( data );
        if( data.transportadoraSelect === "ENVIA") this.viewRotulo( data.ven_imagen_guia );
        if( data.transportadoraSelect === "TCC") this.imprimirGuia( data );
        data.ven_estado = 6;
        this.handleUpdateGuide( data );
        resolve( true );
      });
    })
  }

  handleDelete( ){
    this.dataTable.dataRows = this.dataCache;
    this.datoBusqueda = "";
    this.filtro = {
      dateStart: moment().format('YYYY-MM-DD'),
      dateEnd: moment().format('YYYY-MM-DD')
    };
    this._tools.tooast({ title: "Filtro Borrados..."} )
  }

  handlePrintGuide( data ){
    console.log("****377", data)
    if( data.transportadoraSelect === "CORDINADORA") this.imprimirGuia( data );
    if( data.transportadoraSelect === "ENVIA") this.viewRotulo( data.ven_imagen_guia );
    if( data.transportadoraSelect === "TCC") this.imprimirGuia( data );
    if( data.transportadoraSelect === "INTERRAPIDISIMO" ){
      let datas:any = {
         codigo_remision: data['ven_numero_guia']
      };
      this._venta.getFletesInter( datas ).subscribe(( res:any )=>{
        res = res.data;
        if( res == "Error") return false;

        this._tools.downloadPdf( res, 'INTERRAPIDISIMO #'+ data.ven_numero_guia  );
      });
    }
  }

  async handleCreateGuideMultiple(){
    if( this.btnDisabled === true ) return false;
    this.btnDisabled = true;
    for( let row of this.dataTable.dataRows ) if( row['check'] === true ) await this.handleCreateGuide( row );
    this.buscar();
    this.btnDisabled = false;
  }

  getArticulos( id ) {
    return new Promise( resolve =>{
      this.listCarrito = [];
      this._ventasProducto.get({ where: { ventas: id }, limit: 10000 }).subscribe((res: any) => {
        this.listCarrito = _.map(res.data, (item: any) => {
          return {
            foto: item.fotoproducto || item.producto.foto,
            bodegaName: item.producto.pro_usu_creacion.usu_usuario,
            idBodega: item.producto.pro_usu_creacion.id,
            cantidad: item.cantidad,
            tallaSelect: item.tallaSelect,
            costo: item.precio,
            loVendio: item.loVendio,
            id: item.id,
            costoTotal: item.costoTotal,
            colorSelect: item.colorSelect,
            codigoImg: item.codigoImg || "no seleccionado",
            demas: item
          };
        });
        //this.suma();
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); this.listCarrito = [];  resolve( false ); });
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
    let a = this._tools.seguridadIfrane( urlRotulos );
    window.open( urlRotulos );
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

  handleOpenWhat( tel:number ){
    window.open(`https://wa.me/${ tel }?text=Hola Buen Dia!`)
  }


}
