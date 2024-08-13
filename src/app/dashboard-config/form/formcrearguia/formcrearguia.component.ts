import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-formcrearguia',
  templateUrl: './formcrearguia.component.html',
  styleUrls: ['./formcrearguia.component.scss']
})
export class FormcrearguiaComponent implements OnInit {

  data:any = {};
  data2:any = {};
  dataUser:any = {};
  btndisabled:boolean = false;
  textData:string = "";
  opcionCurrencys:any;

  constructor(
    public dialogRef: MatDialogRef<FormcrearguiaComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
    private _ventas: VentasService,
    private _tools: ToolsService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      //this.dataUser = store.user || {};

    });
    this.opcionCurrencys = this._tools.currency;
  }

  ngOnInit(): void {
    if (Object.keys(this.datas.datos).length > 0) {
      this.data = this.datas.datos || {};
      let valor = 1;
      try {
        valor = this.data['listaArticulo']['length'] || 1;
      } catch (error) {}
      try {
        valor = this.data['articulo']['length'] || 1;
      } catch (error) {}
      console.log("***", valor)
      this.data = {
       ... this.data,
       valorMercancia: this.data.ven_total,
       fecha: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
       numeroUnidad:  1,
       //pesoReal: valor,
       pesoVolumen: "",
       alto: this.data.articulo[0].alto || 9,
       largo: this.data.articulo[0].largo || 28,
       ancho: this.data.articulo[0].ancho || 21,
       valorAsegurado: 50000 * ( valor ),
       selectEnvio: this.data.ven_tipo || 'contraEntrega'
      };
      this.data.pesoReal = this.data.pesoReal || valor,
      this.data.pesoVolumen = ( ( parseFloat( this.data.alto ) * parseFloat( this.data.largo ) * parseFloat( this.data.ancho ) ) / 5000 ) || 1;
      this.data.pesoVolumen = Math.round( this.data.pesoVolumen );
      console.log( this.data )
      this.dataUser = this.data.usu_clave_int;
      this.rellenoData();
    }
  }

  rellenoData(){
    for( let row of this.data.articulo ){
      this.textData+= `${ row.cantidad } ${ row['codigoImg'] } -T${ row.tallaSelect }, `
    }
    this.data2 = {
      transportadoraSelect: this.data.transportadoraSelect,
      idCiudadOrigen: "54001000",
      idCiudadDestino: this.data.codeCiudad,
      selectEnvio: this.data.selectEnvio || 'contraEntrega',
      valorMercancia: this.data.valorMercancia,
      fechaRemesa: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      idUniSNegogocio: 1,
      numeroUnidad: 1,
      pesoVolumen: this.data.pesoVolumen,
      alto: this.data.alto || 9,
      largo: this.data.largo || 28,
      ancho: this.data.ancho || 21,
      drpCiudadOrigen: "CUCUTA-NORTE DE SANTANDER",
      txtIdentificacionDe: this.dataUser.usu_documento || 1093753373,
      txtTelefonoDe: this.dataUser.usu_telefono || 320514638,
      txtDireccionDe: "AV. 10 # 6-30 ( comuneros )",
      txtCod_Postal_Rem: 540001,
      txtEMailRemitente: this.dataUser.usu_email || "fabricadecalzadocolombia@gmail.com",
      txtPara: this.data.ven_nombre_cliente,
      txtIdentificacionPara: this.data.cob_num_cedula_cliente,
      drpCiudadDestino: this.data.ciudadDestino,
      txtTelefonoPara: this.data.ven_telefono_cliente,
      txtDireccionPara: this.data.ven_direccion_cliente,
      txtDice: this.textData,
      txtNotas: "ok",
      txtEMailDestinatario: "joseeduar147@gmail.com",

      codigo: this._tools.codigo(),
      solicitudFecha: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      solictudVentanaInicio: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      solictudVentanaFin: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      unidadNegocio: Number( this.data.totalUnidad || 1 ), //OJO
      fechaDespacho: moment( this.data.fecha ).format( "YYYY-MM-DD" ),
      cuentaRemitente: 1422863,
      tipoIdentificacionRemitente: "CC",
      identificacionRemitente: 1093753373,
      sedeRemitent: "",
      nombreRemitente: this.dataUser.usu_nombre || 'Tienda',
      direccionCliente: "",
      emailRemitente: this.dataUser.usu_email || "fabricadecalzadocolombia@gmail.com",
      telefonoRemitente: Number( this.dataUser.usu_telefono || 320514638 ),
      celularRemitente: this.dataUser.usu_telefono || 320514638,
      ciudadOrigen: /*11001000,*/ Number( 54001000 ),
      tipoIdentificacionDestinatario: "CC",
      identificacionDestinatario: Number( this.data.cob_num_cedula_cliente ),
      nombreDestinatario: this.data.ven_nombre_cliente,
      razonsocialDestinatario: this.data.ven_nombre_cliente,
      direccionDestinatario: this.data.ven_direccion_cliente,
      contactoDestinatario: this.data.ven_nombre_cliente,
      emailDestinatario: this.data.ven_usu_creacion,
      telefonoDestinatario: Number( this.data.ven_telefono_cliente ),
      celularDestinatario: Number( this.data.ven_telefono_cliente ),
      ciudadDestinatario: /*11001000,*/ Number( this.data.codeCiudad ),
      barrioDestinatario: this.data.ven_barrio,
      totalPeso: Number( this.data.pesoReal ),
      totalPesovolumen: Number( this.data.pesoVolumen ),
      totalValorMercancia: Number( this.data.ven_total ),
      observaciones: this.data.ven_observacion || "",
      totalValorProducto: "",
      tipoUnidad: "TIPO_UND_PAQ",
      tipoEmpaque: "",
      claseEmpaque: "Bolsa",
      diceContener: this.textData,
      kilosReales: Number( this.data.pesoReal ),
      numeroBolsa: Number( this.data.numeroUnidad || 1 ),
      unidadesInternas: Number( this.data.numeroUnidad || 1 ),
      tipoDocumento: "CC",
      numeroDocumento: Number( this.data.cob_num_cedula_cliente || 999999 ),
      fechaDocumento: "2019-10-10",
      tipoEnvio: "nacionales", // string
      seleccionAgente: "Victor moises", // string
      paisOrigen: "colombia", // string
      paisDestino: "colombia", // string
      valorAsegurado: this.data.valorAsegurado || 100000, //number
      numeroFactura: "1", //number
      flete: this.data.flete,  // boleando
      valorRecaudar: this.data.ven_total,   //number
      destinatarioCosto: this.data.destinatarioCosto, // boleand
      remitenteBarrio: "comuneros", // strint
      destinatarioFechaExpedicion: "2019-10-10", // strint
      destinatarioCelular: this.data.ven_telefono_cliente, // number
      observacionAdicional: "mercancia nacional", //string
      txtUnidades: this.data.numeroUnidad || 1,
      txtPeso: this.data.pesoReal,
      txtVolumen: this.data.pesoVolumen || 5,
      txtDeclarado: this.data.ven_total,
      txtValorRecaudo: this.data.ven_total,
      flteTotal: this.data.fleteValor,
      pesoReal: this.data.pesoReal
    };
    if( this.data.articulo[0] ) this.data2.idBodega = this.data.articulo[0].idBodega;
    this.submit();
  }

  submit(){
    this.data2.diceContener = this.textData;
    this.data2.txtDice = this.textData;
    if( this.btndisabled ) return false;
    this.btndisabled = true;
    //console.log("submit data2", this.data2)
    this._ventas.createFelte( this.data2 ).subscribe( ( res:any ) => {
      console.log( res );
      this.btndisabled = false;
      if( res.status !== 200 || res.data === false  || res.data === "Error en Crear la guia de Inter Servientrega" ) return this._tools.basicIcons({ header: "Error!", subheader: "No pudimos crear el flete por favor actualizar pagina" });
      res = res.data;
      this._tools.basicIcons({ header: "Exitoso!", subheader: "Creacion de flete creado exitoso #remesa " + res.nRemesa });
      //if( res.transportadoraSelect == "CORDINADORA") if( res.urlRotulos ) this._tools.downloadPdf( res.urlRotulos, res.nRemesa);
      this.dialogRef.close( res );
    },(error)=> { this.btndisabled = false;  this._tools.basicIcons({ header: "Error!", subheader: "No pudimos crear el flete por favor actualizar pagina" }); } );
  }


}
