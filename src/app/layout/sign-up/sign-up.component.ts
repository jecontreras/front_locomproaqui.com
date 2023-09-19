import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';

const indicativos = Indicativo;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  data:any = {
    usu_indicativo: "57",
    ids: "XXXXXXXXXXXXXXXXXXXX",
    usu_imagen: './assets/logo.png'
  };
  listIndicativos = indicativos;
  constructor() { }

  ngOnInit(): void {
  }

}
