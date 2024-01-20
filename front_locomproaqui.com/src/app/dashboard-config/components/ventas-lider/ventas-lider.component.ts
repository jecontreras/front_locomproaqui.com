import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { FormventasLiderComponent } from '../../form/formventas-lider/formventas-lider.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-ventas-lider',
  templateUrl: './ventas-lider.component.html',
  styleUrls: ['./ventas-lider.component.scss']
})
export class VentasLiderComponent implements OnInit {


  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      usu_perfil: 3
    },
    page: 0
  };
  Header:any = [ 'Acciones','Nombre','Perfil','E-mail','Telefonos','Fecha Registro','Activo' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _usuarios: UsuariosService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
  }

  crear( obj:any ){
    obj.vista = "subvendedores";
    const dialogRef = this.dialog.open(FormventasLiderComponent,{
      data: obj || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._usuarios.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
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
    this._usuarios.get(this.query)
    .subscribe(
      (response: any) => {
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data);
        this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
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
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.dataTable.dataRows = [];
    this.query = { where:{ usu_perfil: 3 }, page: 0 };
    if (this.datoBusqueda !== '') {
      this.query.page = 0;
      this.query.where.or = [
        {
          usu_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_email: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_apellido: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          usu_telefono: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
    }
    this.cargarTodos();
  }

}
