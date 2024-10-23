import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { latLng, tileLayer, marker, icon, Marker } from 'leaflet';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-form-ventas-vera',
  templateUrl: './form-ventas-vera.component.html',
  styleUrls: ['./form-ventas-vera.component.scss']
})
export class FormVentasVeraComponent implements OnInit {

  files: File[] = [];
  list_files: any = [];
  data:any = {

  };
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";

  listCategoria:any = [];
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  opcionCurrencys: any = {};
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
    ],
    zoom: 13,
    center: latLng(40.730610, -73.935242) // Valores iniciales, puedes cambiarlos luego
  };

  layers: Marker[] = [];
  dataUser:any = {};
  rolName:string = "";

  constructor(
    public dialog: MatDialog,
    private _ventasSerice: VentasService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormVentasVeraComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = store.user || {};
      try {
        this.rolName = this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {
        
      }
    });
    this.opcionCurrencys = this._tools.currency;
  }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";

      const latitude = this.data.latitude; // Asegúrate de que estos nombres coincidan con tu estructura de datos
      const longitude = this.data.longitude;

      this.layers = [
        marker([ latitude, longitude ], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: './assets/flecha.png',
          })
        })
      ];

      this.options.center = latLng( latitude, longitude ); // Recentrar el mapa en la nueva ubicación

      this.data.totalArticulo= this.data.totalAPagar - this.data.totalFlete;
    }else{this.id = ""}
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  subirFile(){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res:any)=>{
      //console.log(res);
      this.data.cat_imagen = res.files;//URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      if(this.id)this.submit();
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  handleOrdenP(){
    this.pedidoGuardar( this.data );
  }

    //edu
    pedidoGuardar(pedido){
      //console.log("pedido", pedido)
      const options = {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(pedido)
      }
      let url = "http://localhost/pedidosweb/api/lokompro/pedidolw.php";
      url = "https://ginga.com.co/pedidosweb/api/lokompro/pedidolw.php";
      url = "https://y79.ae1.mytemp.website/api/lokompro/pedidolw.php";
      fetch( url,options)
      .then(response => response.json())
      .then( async (data) => { //console.log("api pedidoslw",data)
        if(data.response == "ok"){
          console.log("Pedido Realizado")
          this._tools.presentToast(data.msj);
          this.data.notifiedWeb = 0;
          this.updates();
        }else{
          this._tools.presentToast(data.msj);
        }
      })
    }

  submit(){
    console.log(this.data.cat_activo)
    // if(this.data.cat_activo) this.data.cat_activo = 0;
    // else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar( item:any = this.data ){
    this._ventasSerice.create( item ).subscribe((res:any)=>{
      //console.log(res);
      this.data.id = res.id;
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
  }

  updates( item:any = this.data ){
    item = _.omit(item, [ 'listProduct' ])
    item = _.omitBy(item, _.isNull);
    this._ventasSerice.updateVentasL( item ).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

  submitState(){

  }


}
