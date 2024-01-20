import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertaGanadorComponent } from './extra/alerta-ganador/alerta-ganador.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'locomproAqui';
  constructor(
    public dialog: MatDialog,
  ){
    //this.abrirVenta();
  }

  abrirVenta(){
    const dialogRef = this.dialog.open( AlertaGanadorComponent,{
      data: {datos: {}},
      // height:  '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
