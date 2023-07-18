import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';
import { FormPaymentDetailComponent } from '../../form/form-payment-detail/form-payment-detail.component';
import { FormControl, FormGroup } from '@angular/forms';

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

    },
    limit: 10,
    page: 0
  };
  filter:any ={

  };
  listSeller:any = [];
  keyword:string;
  campaignOne: FormGroup;
  campaignTwo: FormGroup;

  constructor(
    private _supplier: SupplierAccountantService,
    public dialog: MatDialog,
    public _tools: ToolsService
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });
  }

  ngOnInit(): void {
    this.getSupplier();
  }

  handleSelectShop( ev:any ){
    console.log("**EV", ev);
  }

  onChangeSearch( ev:any ){
    console.log( ev )

  }

  getSupplier(){
    return new Promise( resolve =>{
      this._supplier.get( this.querys ).subscribe( res =>{
        this.resultsLength= res.count;
        this.dataSource = res.data;
      })
      resolve( true )
    });
  }

  handleFilter(){

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
  user: string;
  bank: string;
  amount: number;
  fechaPago: string;
  state: string;
  photo: string;
}

const ELEMENT_DATA: itemRecaudoPR[] = [];
