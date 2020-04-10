import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TerminosComponent } from 'src/app/layout/terminos/terminos.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  terminos(){
    const dialogRef = this.dialog.open(TerminosComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openaVenta(){
    let url:string = `https://publihazclickcom.wixsite.com/misitio`;
    window.open( url );
  }

}
