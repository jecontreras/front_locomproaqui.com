import { Component, OnInit } from '@angular/core';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  
  listGaleria:any = [];
  
  constructor(
    private _catalago: CatalogoService
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this._catalago.getDetallado( { where: { /*catalago: ,*/ estado: 0 }, limit: -1 } ).subscribe(( res:any )=>{
      this.listGaleria = res.data;
    });
  }

}
