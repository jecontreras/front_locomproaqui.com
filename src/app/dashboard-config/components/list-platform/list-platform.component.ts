import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { FormPlatformComponent } from '../../form/form-platform/form-platform.component';
import { PlatformService } from 'src/app/servicesComponents/platform.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';


declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-list-platform',
  templateUrl: './list-platform.component.html',
  styleUrls: ['./list-platform.component.scss']
})
export class ListPlatformComponent implements OnInit {
  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      estado: [0, 2]
    },
    limit: 10
  };
  Header:any = [ 'Acciones','Nombre Plataforma','Id Sucursal','Telefono','Estado','Creado' ];
  $:any;
  public datoBusqueda = '';

  listSeller:any = DANEGROUP;
  keyword = 'usu_usuario';
  txtCiudad:any = {};
  dataUser:any = {};
  rolName:string;
  count:number = 0;

  constructor(
    private _platform: PlatformService,
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _user: UsuariosService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {}
    });
  }

  async ngOnInit() {
    this.cargarTodos();
    this.listSeller = await this.getSeller();
  }

  getSeller(){
    return new Promise( resolve =>{
      this._user.getStore( { where: { rol:"proveedor" }, limit: 1000000000 } ).subscribe( res =>{
        return resolve( res.data || [] );
      });
    });
  }

  handleSelectShop( ev:any ){
    if( ev.id  ){
      this.query.where.user = ev.id;
    }else{
      delete this.query.where.user;
    }
    this.query.limit= 10;
    this.query.skip = 0;
    this.dataTable.dataRows = [];
    this.loader = true;
    this.cargarTodos();
  }

  onChangeSearch( ev:any ){
    console.log( ev )

  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormPlatformComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    obj.cat_activo = 2;
    this._platform.update(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }

  pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }


  cargarTodos() {
    if( this.rolName !== 'administrador' ) this.query.where.user = this.dataUser.id;
    this._platform.get(this.query)
    .subscribe(
      (response: any) => {
        this.count = response.count || 0;
        this.dataTable = {
          headerRow: this.Header,
          footerRow: this.Header,
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        console.log("response.data;",response.data)
        this.dataTable.dataRows = response.data;
        this.paginas = Math.ceil(response.count/10);
        this.loader = false;
        setTimeout(() => {
          this.config();
          console.log("se cumplio el intervalo");
        }, 500);
      },
      error => {
        console.log('Error', error);
      });
  }
  config() {
    if(!this.$)return false;
    $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }

    });

    const table = $('#datatables').DataTable();

    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  buscar() {
    this.loader = true;
    this.dataTable.dataRows = [];
    this.query = {};
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        estado: [0, 2]
      },
      limit: 10
    };
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          namePlatform: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    this.cargarTodos();
  }

}
