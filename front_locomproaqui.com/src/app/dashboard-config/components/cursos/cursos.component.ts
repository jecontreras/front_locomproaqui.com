import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/servicesComponents/cursos.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  listCursos: any = [];
  dataSelec:any = {
    url: "https://videoslokompro.s3.amazonaws.com/traer+vendedores+Lokomproaqui.mp4",
    titulo: "empezando",
    img: "./assets/img/fondo.png"
  };
  querys:any = {
    sort: "orden asc",
    where:{

    },
    limit: 10000
  }
  constructor(
    private _cursos: CursosService
  ) { }

  ngOnInit(): void {
    this.getCursos();
  }

  getCursos(){  
    this._cursos.get( this.querys ).subscribe( ( res:any )=>{ console.log("ubotvo")
      this.listCursos = res.data; 
      this.dataSelec = res.data[0] || {};
      this.selectCurso( this.dataSelec );
    });
  }

  selectCurso( item:any ){
    for( let row of this.listCursos ) row.check = false;
    item.check = !item.check;
    this.dataSelec = item;
  }

}
