import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgImageSliderComponent } from 'ng-image-slider';
import { CART } from 'src/app/interfaces/sotarage';
import { TerminosGeneralesComponent } from 'src/app/layout/terminos-generales/terminos-generales.component';
import { TerminosComponent } from 'src/app/layout/terminos/terminos.component';
import { TratamientoDatoComponent } from 'src/app/layout/tratamiento-dato/tratamiento-dato.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChild('nav',{static: false} ) private nav: any
  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  dataUser:any = {};
  userId:any = {};

  sliderWidth: Number = 1204;
  sliderImageWidth: Number = 650;
  sliderImageHeight: Number = 44;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 2.4;
  imageObject: any = [];

  breakpoint: number;

  constructor(
    public dialog: MatDialog,
    private _store: Store<CART>,
  ) {
    console.log("**",window.innerWidth)
    if( (window.innerWidth >= 1000) ) this.sliderImageWidth = 900;
    if( (window.innerWidth <= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 770) ) this.sliderImageWidth = 460;
    if( (window.innerWidth <= 520) ) this.sliderImageWidth = 420;
    if( (window.innerWidth <= 450) ) this.sliderImageWidth = 370;
    if( (window.innerWidth <= 420) ) this.sliderImageWidth = 300;
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    setInterval(()=> {
      let color:string = ( this.dataUser.usu_color || "#02a0e3" );
      if( this.userId.id ) color = this.userId.usu_color || "#02a0e3";
      this.nav.nativeElement.style.backgroundColor = color;
    }, 100 );
    //this.listaBanner();
    this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
    console.log("****60", this.breakpoint)
  }

  listaBanner() {
    var count = 0;
    for (let i = 0; i < 18; i++) {
      count++;
      this.imageObject.push({
        image: `./assets/img/baner.jpeg`,
        thumbImage: `./assets/img/baner.jpeg`,
        alt: 'https://lamejorfabricadeca.wixsite.com/misitio-1',
        id: i,
      });
    }
  }

  terminos() {
    const dialogRef = this.dialog.open(TerminosComponent, {
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleOpenTermino(){
    const dialogRef = this.dialog.open(TerminosGeneralesComponent, {
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleOpenTratamientoD(){
    const dialogRef = this.dialog.open(TratamientoDatoComponent, {
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleWhatsapp(){
    console.log("*88ENTRE")
    let url = "https://wa.me/573213692393?text=Hola Servicio al cliente";
    window.open(url);
  }

  openaVenta() {
    let url: string = `https://publihazclickcom.wixsite.com/misitio`;
    window.open(url);
  }

  arrowOnClick(event) {
    //console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
    //console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }

  imageOnClick(ev:any){
    console.log("hey");
  }

}
