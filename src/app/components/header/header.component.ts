import { Component, OnDestroy, ChangeDetectorRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showFiller = false;
  public mobileQuery: any;
  breakpoint: number;
  private _mobileQueryListener: () => void;
  menus:any = [];
  menus2:any = [];
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private router: Router
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;
    this.listMenus();
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.onResize(null);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  onResize(event:any) {
    // console.log("hey", event);
    if (event) {
      this.breakpoint = (event.target.innerWidth <= 700) ? 1 : 6;
    }
    // console.log(this.breakpoint);
    if (this.breakpoint === 1) {
      this.mobileQuery.ds = true;
    } else {
      // console.log(this.mobileQuery);
      this.mobileQuery.ds = false;
    }
  }
  EventMenus(obj:any){
    console.log(obj);
  }
  listMenus(){
    this.menus = [
      {
        icons: 'home',
        nombre: 'Inicio',
        url: '.',
        submenus:[]
      },
      {
        icons: 'account_circle',
        nombre: 'Mi Cuenta',
        url: '.',
        submenus:[]
      },
      {
        icons: 'shop',
        nombre: 'Mis Cobros',
        url: '.',
        submenus:[]
      },
      {
        icons: 'security',
        nombre: 'Seguridad',
        url: '.',
        submenus:[]
      },
      {
        icons: 'settings',
        nombre: 'Configuración',
        url: '.',
        submenus:[]
      },
      {
        icons: 'assessment',
        nombre: 'Informes',
        url: '.',
        submenus:[]
      },
    ];
    this.menus2 = [
      {
        icons: 'account_circle',
        nombre: 'Iniciar Sección',
        url: 'logout()',
        submenus:[]
      },
      {
        icons: 'supervisor_account',
        nombre: 'Registrarce',
        url: '.',
        submenus:[]
      },
      {
        icons: 'exit_to_app',
        nombre: 'Salir',
        url: '.',
        submenus:[]
      },

    ];
  }

}
