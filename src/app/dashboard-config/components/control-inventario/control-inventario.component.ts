import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { FormproductosComponent } from '../../form/formproductos/formproductos.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-control-inventario',
  templateUrl: './control-inventario.component.html',
  styleUrls: ['./control-inventario.component.scss']
})
export class ControlInventarioComponent implements OnInit {
  
  data:any = {
    fecha: moment().format("YYYY-MM-DD"),
  };

  listArticulos:any = [];
  opcionCurrencys:any = {};


  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Acciones','Foto','Nombre','Codigo', 'Precio', 'Categoria','Estado', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  seleccionoColor:any = [];

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _tools: ToolsService,
    private _productos: ProductoService
  ) { 
    this.opcionCurrencys = this._tools.currency;
  }

  ngOnInit(): void {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormproductosComponent,{
      data: {datos: obj || {}},
      // height:  '550px',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    let datos = {
      id: obj.id,
      pro_activo: 1
    }
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      if(opt.value){
        this._productos.update(datos).subscribe((res:any)=>{
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
    this._productos.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.listArticulos.push(... response.data);
        this.listArticulos =_.unionBy(this.listArticulos || [], response.data, 'id');
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
    this.listArticulos = [];
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        pro_activo: 0
      },
      limit: 10
    }
    if ( this.datoBusqueda != '' ) {
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



  colorSeleccionado( item:any ){
    try {
      item.listSeleccionoColor = item.listColor.find( ( row:any )=> row.talla == item.colorSltc );
      item.listSeleccionoColor.tallaSelect = item.listSeleccionoColor.tallaSelect.filter( ( row:any ) => row.cantidad > 0 && row.check == true );
    } catch (error) { }
  }

  TallaSeleccionado( item:any ){
    try {
      item.detalleSeleccion = item.listSeleccionoColor.tallaSelect.find( ( row:any ) => row.tal_descripcion == item.tallaSltc );
    } catch (error) { }
  }

}
