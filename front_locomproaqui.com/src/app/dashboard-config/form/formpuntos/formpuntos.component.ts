import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-formpuntos',
  templateUrl: './formpuntos.component.html',
  styleUrls: ['./formpuntos.component.scss']
})
export class FormpuntosComponent implements OnInit {
  
  data:any = {};
  info:any = {};

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService
  ) { }

  ngOnInit(): void {
  }

  buscarEmail(){
    this._user.get({
      where:{
        usu_email: this.data.email
      }
    }).subscribe((res:any)=>{
      res = res.data[0];
      this.info = {};
      if(res) { 
        this.info.user = res;
        this._tools.presentToast("Usuario Encontrado");
      }else this._tools.presentToast("Usuario no encontrado por favor vereficar");
    },(error)=> this._tools.presentToast('Error de Servidor'));
  }

  submit(){
    if( !this.info.user ) return this._tools.presentToast("Error usuario no Asignado");
    if( !this.data.ganancias ) return this._tools.presentToast("Error monto no valido");
    this._user.darPuntos({
      user: this.info.user.id,
      ganancias: this.data.ganancias
    }).subscribe((res:any)=>{
      console.log(res);
      this._tools.presentToast("Puntos asignados");
      this.data = {};
      this.info = {};
    },(error)=> this._tools.presentToast("Error de servidor"));
  }

}
