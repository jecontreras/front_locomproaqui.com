import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/servicesComponents/cursos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
@Component({
  selector: 'app-cursos',
  templateUrl: './cursosView.component.html',
  styleUrls: ['./cursosView.component.scss']
})
export class CursosViewComponent implements OnInit {
  listCursos: any = [];
  dataSelec:any = {
    url: "https://videoslokompro.s3.amazonaws.com/traer+vendedores+Lokomproaqui.mp4",
    titulo: "empezando",
    img: "./assets/img/fondo.png"
  };
  videoid
  querys:any = {
    sort: "orden asc",
    where:{

    },
    limit: 10000
  }
  dataUser:any = {};
  constructor(
    private _cursos: CursosService,
    private activate: ActivatedRoute,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user;
      console.log("datauser", this.dataUser)
    });
   }

  ngOnInit(): void {
    this.videoid =  this.activate.snapshot.paramMap.get('id')
    this.getCursos();
    console.log("cursos", this.listCursos)
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

  actualizar(){
    console.log("dataSelect", this.dataSelec)
    const curso = {
      id : this.dataSelec.id,
      titulo: this.dataSelec.titulo,
      descripcion : this.dataSelec.descripcion
    }
    const res = this._cursos.update(curso).subscribe( ( res:any )=>{ 
      this._tools.basicIcons({header: "Actualizando", subheader: `Informacion del Video Actualizada`});
      console.log("res", res) })
  }

}
