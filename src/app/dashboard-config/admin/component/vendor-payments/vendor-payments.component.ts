import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';

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
  }
  constructor(
    private _supplier: SupplierAccountantService,
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.getSupplier();
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

}

export interface itemRecaudoPR {
  user: string;
  bank: string;
  amount: number;
  fechaPago: string;
  state: string;
}

const ELEMENT_DATA: itemRecaudoPR[] = [];
