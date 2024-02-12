import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/servicesComponents/cursos.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-cursos',
  templateUrl: './cursosView.component.html',
  styleUrls: ['./cursosView.component.scss']
})
export class CursosViewComponent implements OnInit {
  listCursos: any = [];
  dataSelec:any = {}
  videoid
  // {
  //   url: "https://videoslokompro.s3.amazonaws.com/traer+vendedores+Lokomproaqui.mp4",
  //   titulo: "empezando",
  //   img: "./assets/img/fondo.png"
  // };
  querys:any = {
    sort: "orden asc",
    where:{

    },
    limit: 10000
  }
  constructor(
    private _cursos: CursosService,
    private activate: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.videoid =  this.activate.snapshot.paramMap.get('id')
    this.getCursos();
  }

  getCursos(){  
    this._cursos.get( this.querys ).subscribe( ( res:any )=>{
      this.listCursos = res.data;
      // this.dataSelec = res.data[0] || {};
      // this.selectCurso( this.dataSelec );
      console.log("videos", this.listCursos)
      this.defineCurso()
    });
  }

  defineCurso(){
    let video = this.listCursos.find((el) => el.id == this.videoid)
    this.selectCurso( video )
  }

  selectCurso( item:any ){
    for( let row of this.listCursos ) row.check = false;
    // item.check = !item.check;
    this.dataSelec = item;
  }

}
