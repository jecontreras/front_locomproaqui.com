import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';
import { FormPaymentDetailComponent } from '../../form/form-payment-detail/form-payment-detail.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-vendor-payments',
  templateUrl: './vendor-payments.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./vendor-payments.component.scss']
})
export class VendorPaymentsComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Usuario', 'Email', 'Banco', 'Monto', 'FechaPago', 'Estado'];
  expandedElement: itemRecaudoPR | null;
  resultsLength:number = 0;
  querys:any ={
    where:{
      state: 0
    },
    limit: 30,
    page: 0
  };
  filter:any ={ };
  listSeller:any = [];
  keyword:string;

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;

  constructor(
    private _supplier: SupplierAccountantService,
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _user: UsuariosService
  ) { }

  async ngOnInit() {
    this.getSupplier();
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
    //console.log("**EV", ev);
  }

  onChangeSearch( ev:any ){
    //console.log( ev )
  }

  async onScroll( ev:any ){
    if (this.notscrolly && this.notEmptyPost) {
        this.querys.page = ev.pageIndex;
        this.querys.limit = ev.pageSize;
        this.notscrolly = false;
        await this.getSupplier();
     }
   }

  getSupplier(){
    return new Promise( resolve =>{
      this._supplier.get( this.querys ).subscribe( res =>{
        this.resultsLength = res.count;
        this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
      })
      resolve( true )
    });
  }

  handleFilter(){
    console.log( this.filter )
    if( this.filter.state ) this.querys.where.state = this.filter.state;
    //if( this.filter.date ) this.querys.where.date = this.filter.date;
    this.dataSource = [];
    this.getSupplier();
  }

  handlePago( item:itemRecaudoPR ){
    const dialogRef = this.dialog.open(FormPaymentDetailComponent,{
      data: {
        list: [],
        data: item
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

export interface itemRecaudoPR {
  id?: number;
  user: string;
  bank: string;
  amount: number;
  fechaPago: string;
  state: string;
  photo: string;
}

const ELEMENT_DATA: itemRecaudoPR[] = [];
