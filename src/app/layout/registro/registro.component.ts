import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';
import { ToolsService } from 'src/app/services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction, TokenAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { TerminosComponent } from '../terminos/terminos.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

const indicativos = Indicativo;

@Component({
  selector: 'app-registros',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistrosComponent implements OnInit {
  
  data:any = {
    usu_indicativo: "57"
  };
  listIndicativos = indicativos;
  disableSubmit:boolean = true;
  isLinear:boolean = true;

  dataUser:any = {};
  cabeza:any;
  error:string;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private _authSrvice: AuthService,
    public dialog: MatDialog,
    private activate: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if(this.activate.snapshot.paramMap.get('id')){
      this.cabeza = ( this.activate.snapshot.paramMap.get('id') );
      this.getCabeza();
    }else this.data.cabeza = 1;
    if (this._authSrvice.isLoggedIn()) this._router.navigate(['/pedidos']);
  }

  validadorEmail( email:string ){
    let validador:any = email.split("@");
    validador = validador[1];
    if( validador ){
      validador = validador.toLowerCase();
      console.log( validador );
      if( ( validador == "gmail.com" ) || ( validador == "hotmail.com" ) || ( validador == "hotmail.es" ) || ( validador == "outlook.com" ) || ( validador == "outlook.es" ) ) { this.error = ""; return true; }
      else this.error = "Error el dominio tiene que ser gmail o hotmail o outlook";
    }
  }

  getCabeza(){
    this._user.get({where:{ id: this.cabeza }}).subscribe((res:any)=>{ console.log(res); this.dataUser = res.data[0]; this.data.cabeza = this.dataUser.id; }, (error)=>console.error(error) );
  }

  submit(){
    if(!this.disableSubmit) return false;
    this.disableSubmit = false;
    let valid: boolean = this.validando();
    if( !valid && this.error ) return false;
    this._user.create(this.data).subscribe((res:any)=>{
      console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        this._store.dispatch(accion);
        accion = new TokenAction( { token: res.data.tokens }, 'post');
        this._store.dispatch( accion );
        this._router.navigate(['/pedidos']);
        this._tools.basicIcons({header: "Hola Bienvenido!", subheader: `Hola ${ res.data.usu_nombre } Que tengas un buen dia`});
        setTimeout(()=>{ 
          location.reload();
        }, 3000);
      }else this._tools.tooast( { title: res.data, icon: "error" } );
    },(error)=>{ console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
  }

  validando(){
    if( !this.data.usu_nombre ) { this._tools.tooast( { title: "Error falta el nombre", icon: "error" }); return false; }
    if( !this.data.usu_apellido ) { this._tools.tooast( { title: "Error falta el Apellido", icon: "error" }); return false; }
    if( !this.data.usu_indicativo ) { this._tools.tooast( { title: "Error falta el Indicativo", icon: "error" }); return false; }
    if( !this.data.usu_telefono ) { this._tools.tooast( { title: "Error falta el Telefono", icon: "error" }); return false; }
    if( !this.data.usu_ciudad ) { this._tools.tooast( { title: "Error falta la Ciudad", icon: "error" }); return false; }
    if( !this.data.usu_direccion ) { this._tools.tooast( { title: "Error falta el Direccion", icon: "error" }); return false; }
    if( !this.data.usu_email ) { this._tools.tooast( { title: "Error falta la Email", icon: "error" }); return false; }
    if( !this.data.usu_emailReper ) { this._tools.tooast( { title: "Error falta el Email repetir", icon: "error" }); return false; }
    if( this.data.usu_emailReper != this.data.usu_email ) { this._tools.tooast( { title: "Error los Emails no son iguales", icon: "error" }); return false; }
    if( !this.data.usu_clave ) { this._tools.tooast( { title: "Error falta la clave", icon: "error" }); return false; }
    if( !this.data.usu_confir ) { this._tools.tooast( { title: "Error falta la clave de confirmar", icon: "error" }); return false; }
    if( this.data.usu_confir !=  this.data.usu_clave ) { this._tools.tooast( { title: "Error las claves no son correctas", icon: "error" }); return false; }
    return true;
  }
  
  terminos(){
    const dialogRef = this.dialog.open(TerminosComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
