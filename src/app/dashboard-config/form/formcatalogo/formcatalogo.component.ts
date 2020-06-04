import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-formcatalogo',
  templateUrl: './formcatalogo.component.html',
  styleUrls: ['./formcatalogo.component.scss']
})
export class FormcatalogoComponent implements OnInit {
  
  listGaleria:any = [];
  data:any = {};
  id:any;
  titulo:string = "Crear";
  datoBusqueda:string = "";
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    sort: "createdAt DESC",
    limit: 10
  };
  lisProductos:any = [];
  disableEliminar:boolean = false;
  loader:boolean = false;

  count:Number = 0;

  constructor(
    public dialog: MatDialog,
    private _catalogo: CatalogoService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcatalogoComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.cargarTodos();
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      this.getArticuloAsignados();
    }else{this.id = ""}
  }

  cargarTodos() {
    this._productos.get( this.query ).subscribe(
      (response: any) => {
        this.count = response.count;
        this.lisProductos.push(... response.data);
        this.lisProductos =_.unionBy(this.lisProductos || [], response.data, 'id');
        this.cambiarEstadoProducto();
      });
  }

  cambiarEstadoProducto(){
    for( let row of this.lisProductos ){
      let filtro = this.listGaleria.find( ( item:any ) => item.producto == row.id );
      row.producto = row.id;
      if(filtro ) { row.check = true; row.id = filtro.id; }
    }
  }

  pageEvent(ev:any){
    //console.log(ev);
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  getArticuloAsignados(){
    this.spinner.show();
    this._catalogo.getDetallado({ where: { catalago: this.id }, limit: -1 }).subscribe((res:any)=> {
      this.listGaleria = _.map( res.data, (row)=>{
        return {
          id: row.id,
          foto: row.producto.foto,
          producto: row.producto.id,
          pro_nombre: row.producto.pro_nombre,
          check: true
        };
      });
      this.spinner.hide();
      this.cambiarEstadoProducto();
      });
  }

  seleccionArticulo( item:any ){
    if(!item.check) { if( this.id ) this.guardarSeleccion( item ); this.listGaleria.push( item );}
    else { if( this.id ) this.eliminarSeleccion( item ); this.listGaleria = this.listGaleria.filter( (row:any )=> row.id !== item.id ); }
  }

  guardarSeleccion( item:any ){
    //console.log(item);
    item.check = !item.check;
    return new Promise( resolve=>{
      this.disableEliminar = true;
      let data:any = {
        catalago: this.id,
        producto: item.producto
      };
      this._catalogo.createDetallado(data).subscribe((res:any)=>{
        this.disableEliminar = false;
        item.id = res.id;
        this._tools.presentToast("Agregado");
        resolve( res );
      },(error:any)=> { this.disableEliminar = false; this._tools.presentToast("Error de servidor"); resolve( false ); });
    })
  }

  eliminarSeleccion( item:any ){
    //console.log(item);
    item.check = !item.check;
    this.listGaleria = this.listGaleria.filter( (row:any )=> row.id !== item.id );
    if( !item.id || !this.id ) return true;
    if( !item.producto ) return false;
    let data:any = {
      id: item.id
    };
    this.disableEliminar = true;
    let filtro:any = _.findIndex( this.lisProductos, [ 'producto', item.producto]);
    //console.log(filtro);
    if( filtro > 0 ) this.lisProductos[filtro].check = false;
    this._catalogo.deleteDetallado( data ).subscribe((res:any)=>{
      this.disableEliminar = false;
       this._tools.presentToast("Eliminado");
    },(error:any)=> { this.disableEliminar = false; this._tools.presentToast("Error de servidor")});

  }

  buscar(){
    this.lisProductos = [];
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        pro_activo: 0
      },
      limit: 10
    }
    if (this.datoBusqueda !== '') {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    this.cargarTodos();
  }

  submit(){
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar(){
    this._catalogo.create(this.data).subscribe(async (res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
      this.id = res.id;
      if( Object.keys(this.listGaleria).length > 0 ) {
        for( let row of this.listGaleria ){
          await this.guardarSeleccion( row );
        }
      }
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }

  updates(){
    this._catalogo.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
