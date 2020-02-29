import { Component, OnInit } from '@angular/core';
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

  }
  rellenoRedes(){
    if(this.dataUser.id || !this.userId.id) {
      this.urlFacebook = `https://www.facebook.com/CLICKEAMEVICTORLANDAZURY?fref=search&__tn__=%2Cd%2CP-R&eid=ARBwh7n8hr6OUXCIoOSMGvfyrxPaixr69annbby3aYVJvFo0_NKpHRBDRYhNAdxpF5-prIsBz_6Lsush`;
      this.urlInstagram = `http://bit.ly/quieroempezaryamismo`;
      this.urlWhatsapp = `http://bit.ly/grupovende`;
      this.urlYoutube = `http://bit.ly/YOUTUBEZAFIRO`;
    }else{
      this.urlFacebook = this.userId.url_facebook || `https://www.facebook.com/CLICKEAMEVICTORLANDAZURY?fref=search&__tn__=%2Cd%2CP-R&eid=ARBwh7n8hr6OUXCIoOSMGvfyrxPaixr69annbby3aYVJvFo0_NKpHRBDRYhNAdxpF5-prIsBz_6Lsush`;
      this.urlInstagram = this.userId.url_instagram || `http://bit.ly/quieroempezaryamismo`;
      this.urlWhatsapp = this.userId.usu_indicativo || `http://bit.ly/grupovende`;
      this.urlYoutube = this.userId.url_youtube || `http://bit.ly/YOUTUBEZAFIRO`;
    }
  }

}
