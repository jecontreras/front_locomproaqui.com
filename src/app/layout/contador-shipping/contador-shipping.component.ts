import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contador-shipping',
  templateUrl: './contador-shipping.component.html',
  styleUrls: ['./contador-shipping.component.scss']
})
export class ContadorShippingComponent implements OnInit {
  contect = {
    contadorC: 100,
    titleC: "Comercio <br> Registrados",
    contadorD: 100,
    titleD: "Proveedores <br> dropshipping",
    contadorE: 1150,
    titleE: "Envios diarios",
    contadorM: 1150,
    titleM: "Municipios bajo <br> Cobertura"
  };
  constructor() { }

  ngOnInit(): void {
  }

}
