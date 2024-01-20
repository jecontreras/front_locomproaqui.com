import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { FormproductosComponent } from '../../form/formproductos/formproductos.component';
import * as _ from 'lodash';
import { ControlinventarioService } from 'src/app/servicesComponents/controlinventario.service';
import { Store } from '@ngrx/store';

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
  query2:any = {
    where:{
      estado: 1
    },
    page: 0,
    limit: 10
  };
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  seleccionoColor:any = [];
  productosSlc:any = [];  
  dataUser:any = {};

  listHeader:any = [ "Tipo Entrada", "Fecha", "Descripcion", "Accion" ];
  listData:any = [];
  rolName:string;

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private _store: Store<STORAGES>,
    private _controlInventario: ControlinventarioService
  ) { 
    this.opcionCurrencys = this._tools.currency;
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user;
      this.rolName = this.dataUser.usu_perfil.prf_descripcion;
    });
  }

  ngOnInit(): void {
    this.cargarTodos();
    this.getLista();
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
  onScroll( opt:string ){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       if( opt === 'producto' ){
         this.query.page++;
         this.cargarTodos();
       }
       if( opt === 'control' ){
        this.query2.page++;
        this.getLista();
      }
     }
   }

  cargarTodos() {
    this.spinner.show();
    if( this.rolName !== 'administrador') this.query.where.pro_usu_creacion = this.dataUser.id;
    this._productos.get( this.query )
    .subscribe(
      (response: any) => {
        console.log(response);
        this.listArticulos.push(... response.data);
        this.listArticulos =_.unionBy(this.listArticulos || [], response.data, 'id');
        this.loader = false;
        this.spinner.hide();
        this.checkSeleccionados();
        if (response.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
      },
      error => {
        console.log('Error', error);
      });
  }

  checkSeleccionados(){
    for( let row of this.listArticulos ){
      let filtro:any = this.productosSlc.find( item => item.id == row.id );
      if( filtro ) row.check = true;
    }
  }

  buscar() {
    console.log( this.datoBusqueda.length, 1 >= this.datoBusqueda.length, this.datoBusqueda.length > 1 )
    if( this.datoBusqueda.length < 1 ) return false;
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
        /*{
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
        },*/
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
      item.foto2 = item.foto;
      item.foto = item.detalleSeleccion.foto;
    } catch (error) { item.foto = item.foto2 || item.foto; }
  }

  seleccionPr( item:any ){
    item.check =  !item.check;
    let filtro = this.productosSlc.find( ( row:any ) => row.id == item.id );
    if( !filtro ) this.productosSlc.push( item );
    else this.productosSlc = this.productosSlc.filter( ( row:any ) => row.id != item.id );
  }

  submit(){
    if( this.data.id ) this.update();
    else { this.data.user = this.dataUser.id; this.guardar();}
  }

  guardar(){
    let data:any = {
      proveedor: this.data,
      articulos: this.productosSlc
    };
    this._controlInventario.create( data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "guardado exitoso" } );
    });
  }

  update(){
    this._controlInventario.update( this.data ).subscribe( ( res:any )=>{
      this._tools.tooast( { title: "guardado exitoso" } );
    });
  }

  getLista(){
    if( this.rolName !== 'administrador') this.query2.where.user = this.dataUser.id;
    this._controlInventario.get( this.query2 ).subscribe(( res:any )=>{
      this.listData = _.unionBy( this.listData || [], res.data, 'id');
    });
  }

}
