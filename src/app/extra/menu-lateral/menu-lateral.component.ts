import { Component, OnInit, ViewChild } from '@angular/core';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  public estado = true;
  userId:any = {};
  dataUser:any = {};
  urlFacebook:string;
  urlInstagram:string;
  urlYoutube:string;
  urlWhatsapp: string;
  @ViewChild('color1',{ static: false } ) private color1: any
  @ViewChild('color2',{ static: false } ) private color2: any
  @ViewChild('color3',{ static: false } ) private color3: any
  @ViewChild('color4',{ static: false } ) private color4: any

  constructor(
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.rellenoRedes();
    });
  }

  ngOnInit() {

    setInterval(()=> {
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.userId.id ) color = this.userId.usu_color || "#02a0e3";
      try {
        this.color1.nativeElement.style.backgroundColor = color
        this.color2.nativeElement.style.backgroundColor = color
        this.color3.nativeElement.style.backgroundColor = color
        this.color4.nativeElement.style.backgroundColor = color 
      } catch (error) {
        
      }
    }, 100 );

  }
  rellenoRedes(){
    if(this.dataUser.id || !this.userId.id) {
      this.urlFacebook = `https://www.facebook.com/CLICKEAMEVICTORLANDAZURY?fref=search&__tn__=%2Cd%2CP-R&eid=ARBwh7n8hr6OUXCIoOSMGvfyrxPaixr69annbby3aYVJvFo0_NKpHRBDRYhNAdxpF5-prIsBz_6Lsush`;
      this.urlInstagram = `http://bit.ly/quieroempezaryamismo`;
      this.urlWhatsapp = `http://bit.ly/grupovende`;
      this.urlYoutube = `http://bit.ly/YOUTUBEZAFIRO`;
    }else{
      this.urlFacebook = this.userId.url_facebook || "";
      this.urlInstagram = this.userId.url_instagram || "";
      this.urlWhatsapp = `https://wa.me/${ this.userId.usu_indicativo }${ this.userId.usu_telefono }?text=Hola Servicio al cliente` || "";
      this.urlYoutube = this.userId.url_youtube || "";
    }
  }

}
