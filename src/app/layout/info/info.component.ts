import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  contect = {
    contadorC: 100,
    titleC: "Comercio <br> Registrados",
    contadorD: 100,
    titleD: "Proveedores <br> dropshipping",
    contadorE: 1150,
    titleE: "Envios diarios",
    contadorM: 1150,
    titleM: "Municipios bajo <br> Cobertura"
  }
  constructor() { }

  ngOnInit(): void {
  }

}
