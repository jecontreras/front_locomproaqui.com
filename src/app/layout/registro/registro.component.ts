import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { TerminosComponent } from '../terminos/terminos.component';

const indicativos = Indicativo;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistrosComponent implements OnInit {
  
  data:any = {};
  listIndicativos = indicativos;
  dataUser:any = {};
  cabeza:any;
  disableSubmit:boolean = true;

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

  getCabeza(){
    this._user.get({where:{ id: this.cabeza }}).subscribe((res:any)=>{ console.log(res); this.dataUser = res.data[0]; this.data.cabeza = this.dataUser.id; }, (error)=>console.error(error) );
  }

  submit(){
    if(!this.disableSubmit) return false;
    this.disableSubmit = false;
    this._user.create(this.data).subscribe((res:any)=>{
      console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        this._store.dispatch(accion);
        this._router.navigate(['/pedidos']);
        location.reload();
      }
    },(error)=>{ console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
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
