import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';
import { CreateBankComponent } from '../../form/create-bank/create-bank.component';
import { itemRecaudoPR } from 'src/app/dashboard-config/admin/component/vendor-payments/vendor-payments.component';
import * as _ from 'lodash';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormListSaleComponent } from '../../form/form-list-sale/form-list-sale.component';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;


@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
    },
    limit: 10
  };
  Header:any = ['Banco','Numero de Cuenta','Monto retirado','Estado', 'Fecha pago' ];
  $:any;
  public datoBusqueda = '';
  dataUser:any = {};
  superSub:boolean = false;

  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Usuario', 'Email', 'Banco', 'Monto', 'FechaPago', 'Estado'];
  expandedElement: itemRecaudoPR | null;
  resultsLength:number = 0;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;


  constructor(
    private _supplier: SupplierAccountantService,
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _product: ProductoService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
      this.query.where.user = this.dataUser.id;
    });
  }

  ngOnInit() {
    this.getSupplier();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(CreateBankComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._supplier.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }

  cargarTodos() {
    this._supplier.get(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable = {
          headerRow: this.Header,
          footerRow: this.Header,
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
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
  getSupplier(){
    return new Promise( resolve =>{
      this._supplier.get( this.query ).subscribe( res =>{
        this.resultsLength = res.count;
        this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
        console.log("**", this.dataSource, this.resultsLength)
        this.loader = false;
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
      })
      resolve( true )
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

    /* // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    }); */

    /* // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    }); */

    //Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  buscar() {
    this.loader = true;
    this.dataTable.dataRows = [];
    this.notEmptyPost =  true;
    this.notscrolly = true;
    this.dataSource = [];
    this.query = {};
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        //state: 0
        user: this.dataUser.id
      },
      limit: 100
    };
    if (this.datoBusqueda != '') {
      /*this.query.where.or = [
        {
          cat_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cat_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];*/
    }
    this.getSupplier();
  }

  async onScroll( ev:any ){
    if (this.notscrolly && this.notEmptyPost) {
        this.query.page = ev.pageIndex;
        this.query.limit = ev.pageSize;
        this.notscrolly = false;
        await this.getSupplier();
     }
   }

   getPagoComplet( item:itemRecaudoPR ){
    return new Promise( resolve =>{
      this._product.getVentaCompletePago( { checkPaySupplier: item.id } ).subscribe( res =>{
        resolve( res.data );
      });
    });
   }

  async handleBuy( item:itemRecaudoPR ){
    let listData = await this.getPagoComplet( item );
    console.log("**", listData)
    //return false;
    const dialogRef = this.dialog.open(FormListSaleComponent,{
      data: {
        datos: {
          list: listData,
          data: {}
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleEvidence( item:itemRecaudoPR ){
    this._tools.processPhoto( {  photo: item.photo, title: item.fechaPago } );
  }

}

const ELEMENT_DATA: itemRecaudoPR[] = [];
