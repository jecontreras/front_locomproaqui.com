import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { environment } from 'src/environments/environment';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';

const URL = environment.url;

@Component({
  selector: 'app-formventas',
  templateUrl: './formventas.component.html',
  styleUrls: ['./formventas.component.scss']
})
export class FormventasComponent implements OnInit {

  data:any = {
    ven_tipo: 'carrito'
  };
  id:any;
  titulo:string = "Crear";
  files: File[] = [];
  list_files: any = [];
  listProductos:any = [];

  constructor(
    public dialog: MatDialog,
    private _ventas: VentasService,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private _model: ServiciosService,
    public dialogRef: MatDialogRef<FormventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
      this.data.pro_clave_int = this.data.pro_clave_int.id;
    }else{this.id = ""}
    this.getArticulos();
    console.log(this.data)
  }

  getArticulos(){
    this._productos.get({pro_activo: 0}).subscribe((res:any)=>{
      this.listProductos = res.data;
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
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
      console.log(res);
      this.data.ven_imagen_producto = URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      if(this.id)this.submit();
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  PrecioPush(){
    let idx = _.findIndex(this.listProductos, ['id', Number(this.data.pro_clave_int)])
    if(idx >= 0) {
      this.data.ven_precio = this.listProductos[idx].pro_uni_venta;
    }
  }

  suma(){
    if(!this.data.ven_precio || !this.data.ven_cantidad) return false;
    this.data.ven_total = ( Number(this.data.ven_precio) * Number(this.data.ven_cantidad) );
    this.data.ven_ganancias = (  this.data.ven_total * 7.777  / 100 ); 
  }

  submit(){
    this.suma();
    if(this.data.cat_activo) this.data.cat_activo = 0;
    else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar(){
    this.data.cat_activo = 0;
    this._ventas.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }
  updates(){
    this._ventas.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
