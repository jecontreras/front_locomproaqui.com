import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-form-testimonio',
  templateUrl: './form-testimonio.component.html',
  styleUrls: ['./form-testimonio.component.scss']
})
export class FormTestimonioComponent implements OnInit {
  files: File[] = [];
  list_files: any = [];
  data:any = {};
  listProductos:any = [];
  id:any;
  titulo:string = "Crear";
  ShopConfig:any = {};

  constructor(
    public dialog: MatDialog,
    private _producto: ProductoService,
    private _testimonios: TestimoniosService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormTestimonioComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if( !store ) return false;
      this.ShopConfig = store.configuracion || {};
    });
  }

  ngOnInit() {
    console.log("*", this.datas)
    if(this.datas.datos.id)  {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
    }else{
      this.id = "";
      this.data.productos = this.datas.datos.idProduct;
    }
    this.getProductos();
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getProductos(){
    this._producto.getSimply({where:{pro_activo: 0}}).subscribe((res:any)=>{
      //console.log("prods", res.data)
      this.listProductos = res.data;
    }, error=> this._tools.presentToast("error Obteniendo Productos"));
  }

  subirFile( opt:string ){

    return new Promise( resolve =>{
      let form:any = new FormData();
      form.append('file', this.files[0]);
      this._tools.ProcessTime({});
      this._archivos.create(form).subscribe((res:any)=>{
        console.log("_archivos.create",res);
        this.data[opt] = res.files;//URL+`/${res}`;
        this._tools.presentToast("Exitoso");
        if( this.id )this.submit();
        resolve( true );
        this.files = [];
      },(error)=>{console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    })

  }

  handleFileOne($event){
    let url = $event.target.files[0];
    this.files.push( url );
    if( url ) this.subirFile('foto');
  }

  async submit(){
    console.log(this.data.cat_activo)
    this.data.empresa = this.ShopConfig.id;
    // if(this.data.cat_activo) this.data.cat_activo = 0;
    // else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else {
      if( this.files[0] ) await this.subirFile('fotoEvidence');
      this.guardar();
    }
  }

  guardar(){ //console.log("guardar this.data",this.data)
    this._testimonios.create(this.data).subscribe((res:any)=>{
      console.log("create",res);
      this._tools.presentToast("Exitoso");
      this.getProductos()
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }

  updates(){
    // this.data = _.omit(this.data, [ 'cat_usu_actualiz' ])
    // this.data = _.omitBy(this.data, _.isNull);
    console.log("update data", this.data)
    let data = this.data;
    data = _.omit(data, ['usu_perfil', 'cabeza', 'nivel']);
    data = _.omitBy( data, _.isNull);
    this._testimonios.update( data ).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
