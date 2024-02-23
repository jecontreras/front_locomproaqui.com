import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-contador-shipping',
  templateUrl: './contador-shipping.component.html',
  styleUrls: ['./contador-shipping.component.scss']
})
export class ContadorShippingComponent implements OnInit {
  contect = {
    contadorC: 0,
    titleC: "Comercios <br> Registrados",
    contadorD: 0,
    titleD: "Proveedores <br> dropshipping",
    contadorE: 0,
    titleE: "Envios diarios",
    contadorM: 0,
    titleM: "Municipios bajo <br> Cobertura"
  };
  constructor(
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {
    setInterval(()=>{
      if( this.contect.contadorC <= 7000 ) this.contect.contadorC++;
      if( this.contect.contadorD <= 150 ) this.contect.contadorD++;
      if( this.contect.contadorE <= 3200 ) this.contect.contadorE+=10;
      if( this.contect.contadorM <= 520 ) this.contect.contadorM++;
    }, 5 )
  }

}
