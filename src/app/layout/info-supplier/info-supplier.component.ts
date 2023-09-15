import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-supplier',
  templateUrl: './info-supplier.component.html',
  styleUrls: ['./info-supplier.component.scss']
})
export class InfoSupplierComponent implements OnInit {
  listSupplier:any = ["","","","","","","","",""]
  constructor() { }

  ngOnInit(): void {
  }

}
