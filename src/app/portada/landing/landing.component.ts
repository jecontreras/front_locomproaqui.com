import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  dataPro:any = [];
  listGaleria:any = [];
  viewPhoto:string;

  constructor(
    private _productServices: ProductoService
  ) { }

  async ngOnInit() {
    this.dataPro = await this.getProduct();
    this.viewPhoto = this.dataPro.foto;
    try {
      for( let row of this.dataPro.listColor ){
        row.detailsP = {};
        row.tallaSelect = row.tallaSelect.filter( item => item.check === true );
        this.listGaleria.push( ...row.galeriaList );
      }
    } catch (error) { }
    console.log("****", this.dataPro, this.listGaleria)
  }

  getProduct(){
    return new Promise( resolve =>{
      this._productServices.get( { where: { id: 1456 } } ).subscribe( res => resolve( res.data[0] ), error => resolve( error ) );
    })
  }

  handleOpenViewPhoto( photo:string ){
    this.viewPhoto = photo;
  }

  handleOpenViewPhotoG( photo:string, list:any ){
    list.foto = photo;
  }

}
