import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  dataConfig:any = {

  };
  lisTransactions:any = [
    {
      transactions: "Recaudo de pedido contraentrega",
      income: "$90,000",
      discharge: "$-1,071",
      receive: "$88,929"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
