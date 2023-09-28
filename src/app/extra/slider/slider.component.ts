import { Component, Input, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() listGaleria:any = [];
  foto = "https://segundav1.s3.amazonaws.com/optional/1e06f7fd-f576-45f7-9c0d-5c518486b0d4.jpeg.webp"

  constructor(
    private _productos: ProductoService,
  ) { }

  ngOnInit(): void {
    this.getListInitNews();
  }

  getListInitNews(){
    this._productos.getListgetBanner( { } ).subscribe( res => {
      this.listGaleria = res.data;
      console.log( this.listGaleria,this.listGaleria[1] )
      this.foto = this.listGaleria[ 1 ].foto;
    })
  }

}
