import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-open-iframe',
  templateUrl: './open-iframe.component.html',
  styleUrls: ['./open-iframe.component.scss']
})
export class OpenIframeComponent implements OnInit {
  url: any;
  constructor(
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) { 

  }

  ngOnInit(): void {
    console.log( this.datas )
    this.url = this._tools.seguridadIfrane( this.datas.url );
  }

}
