import { Component, OnInit } from '@angular/core';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { FormcobrosComponent } from '../../form/formcobros/formcobros.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss']
})
export class CobrosComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      cob_estado: { '!=' : 3}
    },
    page: 0
  };
  Header:any = [ 'Acciones', 'Monto','Método de pago', 'Pais', 'Estado', 'Fecha Cobro','Email','Perfil','Cédula','Celular','Cuenta Bancaria','Fecha Pago' ];
  $:any;
  public datoBusqueda = '';
  dataUser:any = {};
  dataInfo:any = {};

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  btnDisableRetiro:boolean = true;
  activando:boolean = false;
  count:number = 0;

  constructor(
    private _cobros: CobrosService,
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _user: UsuariosService,
    private _store: Store<STORAGES>,
    private spinner: NgxSpinnerService
  ) {

    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') { this.query.where.usu_clave_int = this.dataUser.id; }
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.activando = true;
    });

  }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
    this.getInfoUser();
    this.disabledRetiro();
  }

  disabledRetiro(){
    if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') return this.btnDisableRetiro = true;
    this._cobros.validador({ user: this.dataUser.id }).subscribe((res:any)=>{
      this.btnDisableRetiro = res.data;
      if(!res.data) {
        if(res.mensaje) this._tools.basicIcons({header: "Retiro Pendiente!", subheader: res.mensaje});
      }
    },(error)=>console.error(error));
  }

  getInfoUser(){
    this._user.getInfo({where:{id:this.dataUser.id}}).subscribe((res:any)=>this.dataInfo = res.data);
  }

  crear(obj:any){
    //console.log(this.btnDisableRetiro, obj)
    if( !this.btnDisableRetiro && !obj ) {
      this._tools.basicIcons({header: `Hola ${ this.dataUser.usu_nombre } cordial saludo`, subheader: "Te informamos que tú solicitud de retiro se hará efectiva y se verá reflejada en tu cuenta de banco de 1 @ 3 días hábiles más información al +573213692393"});
      return false;
    }
    const dialogRef = this.dialog.open(FormcobrosComponent,{
      data: {datos: obj || {}},
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.disabledRetiro();
      this.cargarTodos();
    });
  }

  delete(obj:any, idx:any){
    this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"}).then((opt)=>{
      console.log(opt);
      if(opt.value){
        if(obj.ven_estado == 1) { this._tools.presentToast("Error no puedes ya Eliminar el retiro ya esta aprobada"); return false; }
        this._cobros.delete(obj).subscribe((res:any)=>{
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
   pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }


  cargarTodos() {
    this.spinner.show();
    this._cobros.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.count = response.count || 0;
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
    this.dataTable.dataRows = [];
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
      this.query={
        where:{
          cob_estado: { '!=' : 3}
        },
        page: 0
      };
      if(this.dataUser.usu_perfil.prf_descripcion != 'administrador') this.query.where.usu_clave_int = this.dataUser.id;
      this.cargarTodos();
    } else {
      this.query.where.or = [
        {
          cob_num_cedula: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cob_num_celular: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cob_num_cuenta: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cob_metodo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
      this.cargarTodos();
    }
  }

}
