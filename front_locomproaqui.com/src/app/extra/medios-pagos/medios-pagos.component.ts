import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-medios-pagos',
  templateUrl: './medios-pagos.component.html',
  styleUrls: ['./medios-pagos.component.scss']
})
export class MediosPagosComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MediosPagosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {
  }

  copiarNumer( numero:string, opt:string ){
    if( opt == 'bancolombia') {}
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = numero;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.openSnack('Copiado:' + ' ' + numero, 'completado', false);
  }

}
