import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';

@Component({
  selector: 'app-formcatalogo',
  templateUrl: './formcatalogo.component.html',
  styleUrls: ['./formcatalogo.component.scss']
})
export class FormcatalogoComponent implements OnInit {

  listGaleria: any = [];
  data: any = {};
  id: any;
  titulo: string = "Crear";
  datoBusqueda: string = "";
  query: any = {
    where: {
      pro_activo: 0
    },
    page: 0,
    sort: "createdAt DESC",
    limit: 10
  };
  lisProductos: any = [];
  disableEliminar: boolean = false;
  loader: boolean = false;

  count: Number = 0;
  files: File[] = [];

  btnDisabled:boolean = false;

  constructor(
    public dialog: MatDialog,
    private _catalogo: CatalogoService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcatalogoComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _archivos: ArchivosService
  ) { }

  ngOnInit() {
    this.cargarTodos();
    if (Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      this.getArticuloAsignados();
    } else { this.id = "" }
  }

  cargarTodos() {
    this._productos.get(this.query).subscribe(
      (response: any) => {
        this.count = response.count;
        this.lisProductos.push(...response.data);
        this.lisProductos = _.unionBy(this.lisProductos || [], response.data, 'id');
        this.cambiarEstadoProducto();
      });
  }

  cambiarEstadoProducto() {
    for (let row of this.lisProductos) {
      let filtro = this.listGaleria.find((item: any) => item.producto == row.id);
      row.producto = row.id;
      if (filtro) { row.check = true; row.id = filtro.id; }
    }
  }

  pageEvent(ev: any) {
    //console.log(ev);
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  getArticuloAsignados() {
    this.spinner.show();
    this._catalogo.getDetallado({ where: { catalago: this.id }, limit: -1 }).subscribe((res: any) => {
      this.listGaleria = _.map(res.data, (row) => {
        this.spinner.hide();
        return {
          id: row.id,
          foto: row.producto.foto,
          producto: row.producto.id,
          pro_nombre: row.producto.pro_nombre,
          check: true
        };
      });
      this.cambiarEstadoProducto();
    });
  }

  seleccionArticulo(item: any) {
    if (!item.check) { if (this.id) this.guardarSeleccion(item); this.listGaleria.push(item); }
    else { if (this.id) this.eliminarSeleccion(item); this.listGaleria = this.listGaleria.filter((row: any) => row.id !== item.id); }
  }

  guardarSeleccion( item: any, opt:boolean = false ) {
    //console.log(item);
    item.check = !item.check;
    return new Promise(resolve => {
      this.disableEliminar = true;
      let data: any = {};
      if( opt ){
        data = {
          catalago: this.id,
          foto: item.foto
        }
      }else{
        data = {
          catalago: this.id,
          producto: item.producto
        }
      }
      this._catalogo.createDetallado(data).subscribe((res: any) => {
        this.disableEliminar = false;
        item.id = res.id;
        this._tools.presentToast("Agregado");
        resolve(res);
      }, (error: any) => { this.disableEliminar = false; this._tools.presentToast("Error de servidor"); resolve(false); });
    })
  }

  eliminarSeleccion(item: any) {
    //console.log(item);
    item.check = !item.check;
    this.listGaleria = this.listGaleria.filter((row: any) => row.id !== item.id);
    if (!item.id || !this.id) return true;
    if (!item.producto && !item.foto ) return false;
    let data: any = {
      id: item.id
    };
    this.disableEliminar = true;
    let filtro: any = _.findIndex(this.lisProductos, ['producto', item.producto]);
    //console.log(filtro);
    if (filtro > 0) this.lisProductos[filtro].check = false;
    this._catalogo.deleteDetallado(data).subscribe((res: any) => {
      this.disableEliminar = false;
      this._tools.presentToast("Eliminado");
    }, (error: any) => { this.disableEliminar = false; this._tools.presentToast("Error de servidor") });

  }

  buscar() {
    this.lisProductos = [];
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where: {
        pro_activo: 0
      },
      limit: 10
    }
    if (this.datoBusqueda !== '') {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          pro_descripcion: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.datoBusqueda || ''
          }
        },
        {
          pro_codigo: {
            contains: this.datoBusqueda || ''
          }
        }
      ];
    }
    this.cargarTodos();
  }

  async submit() {
    console.log( this.data.descargar )
    if( this.data.descargar == "true" ) this.data.descargar = Boolean( this.data.descargar );
    else this.data.descargar = false;
    if (this.id) {
      await this.updates();
    }
    else { await this.guardar(); }
    this.dialog.closeAll();
  }

  async guardar() {
    return new Promise( resolve => {
      this._catalogo.create(this.data).subscribe(async (res: any) => {
        //console.log(res);
        this._tools.presentToast("Exitoso");
        this.id = res.id;
        if (Object.keys(this.listGaleria).length > 0) for (let row of this.listGaleria) await this.guardarSeleccion(row);
        resolve( true );
      }, (error) => { this._tools.presentToast("Error"); resolve( false ); });
    })
  }

  async updates() {
    return new Promise( resolve => {
      this._catalogo.update(this.data).subscribe((res: any) => {
        this._tools.presentToast("Actualizado");
        resolve( true );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    });
  }

  onSelect(event: any) {
    //console.log(event, this.files);
    this.files.push(...event.addedFiles)
  }


  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  async subirFile() {
    this.btnDisabled = true;
    if( !this.id ) await this.guardar();
    if( !this.id ) return false;
    for (let row of this.files) await this.fileSubmit( row );
    this.files = [];
    this.btnDisabled = false;
    this._tools.presentToast("Exitoso");

  }

  fileSubmit(row) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', row);
      this._tools.ProcessTime({});
      //this._archivos.create( this.files[0] );
      this._archivos.create(form).subscribe((res: any) => {
        //console.log(res);
        let data:any = {
          foto: res.files,
          pro_nombre: "",
        };
        this.guardarSeleccion( data, true );
        this.listGaleria.push( data );
        resolve(true);
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor") });
    });
  }

}
