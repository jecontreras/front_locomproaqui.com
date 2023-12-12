import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required components
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { BehaviorSubject } from "rxjs";
import Swiper from "swiper/types/swiper-class";
import { Router } from '@angular/router';
import { ViewProductosComponent } from 'src/app/components/view-productos/view-productos.component';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-slider',
  styles: [
    `
      .bg-yellow {
        background-color: yellow;
      }
      .transition {
        transition: background 0.25s ease, color 0.25s ease;
      }
      .active-slide {
        background-color: green;
        color: #fff;
      }
      .bg-blue {
        background-color: blue;
        color: #fff;
      }
    `
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() listGaleria:any = [];
  @Input() routerUrl:string;
  foto = "https://segundav1.s3.amazonaws.com/optional/1e06f7fd-f576-45f7-9c0d-5c518486b0d4.jpeg.webp"
  @Input() view:number;
  @Input() lyImg:string;

  @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

  show: boolean;
  thumbs: any;
  slides$ = new BehaviorSubject<string[]>(['']);
  cantDs:number = 5;
  breakpoint: number;

  constructor(
    private _productos: ProductoService,
    private cd: ChangeDetectorRef,
    private _router: Router,
    private ngZone: NgZone,
    public dialog: MatDialog,
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {

    //if( !this.routerUrl ) this.routerUrl = "/listproduct/categoria";
    //this.getListInitNews();
    setInterval(()=>{
      let tamaño:number = window.innerWidth;
      //console.log("**83", tamaño)
      this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
      //console.log( this.breakpoint, window.innerWidth)
      if( tamaño >= 100 ) this.cantDs = 2;
      if( tamaño >= 500 ) this.cantDs = 2;
      if( tamaño >= 770 ) this.cantDs = 4;
      if( tamaño >= 995 ) this.cantDs = 5;
    }, 100 );
  }

  getListInitNews(){
    this._productos.getListgetBanner( { } ).subscribe( res => {
      this.listGaleria = res.data;
      //console.log( this.listGaleria,this.listGaleria[1] )
      this.foto = this.listGaleria[ 1 ].foto;
    })
  }

  getSlides() {
    this.slides$.next(Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`));
  }

  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }
  controlledSwiper: any;
  setControlledSwiper(swiper) {
    console.log("**105", swiper)
    this.controlledSwiper = swiper;
  }

  indexNumber = 1;
  exampleConfig = { slidesPerView: 3 };
  slidesPerView: number = 4;
  pagination: any = false;

  slides2 = ['slide 1', 'slide 2', 'slide 3'];
  replaceSlides() {
    this.slides2 = ['foo', 'bar'];
  }

  togglePagination() {
    if (!this.pagination) {
      this.pagination = { type: 'fraction' };
    } else {
      this.pagination = false;
    }
  }

  navigation = false;
  toggleNavigation() {
    this.navigation = !this.navigation;
  }

  scrollbar: any = false;
  toggleScrollbar() {
    if (!this.scrollbar) {
      this.scrollbar = { draggable: true };
    } else {
      this.scrollbar = false;
    }
  }
  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1024: { slidesPerView: 4, spaceBetween: 50 },
  };

  slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
  virtualSlides = Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`);

  log(log: string) {
    // console.log(string);
  }

  breakPointsToggle: boolean;
  breakpointChange() {
    this.breakPointsToggle = !this.breakPointsToggle;
    this.breakpoints = {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 4, spaceBetween: 40 },
      1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 50 },
    };
  }

  slidesEx = ['first', 'second'];

  onSlideChange(swiper: any) {
    if (swiper.isEnd) {
      // all swiper events are run outside of ngzone, so use ngzone.run or detectChanges to update the view.
      this.ngZone.run(() => {
        this.slidesEx = [...this.slidesEx, `added ${this.slidesEx.length - 1}`];
      });
      console.log(this.slidesEx);
    }
  }

  handleSelect( item ){
    console.log("***176", item, this.routerUrl)
    this._router.navigate( [ this.routerUrl, item['id'] ] );
  }

  handleView(obj) {
    obj.coinShop = false;
    obj.view = "store";

    const dialogRef = this.dialog.open(ViewProductosComponent, {
      width: this.breakpoint == 6 ? '80%' : "100%",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      //this._router.navigate(['/pedidos']);
    });
  }

  handleImageError(event: any) {
    // Evento que se ejecuta cuando la imagen no se carga correctamente
    // Puedes cambiar la URL de la imagen de segunda opción aquí
    const segundaOpcionURL = './assets/imagenes/todos.png';

    // Asigna la URL de la imagen de segunda opción al src de la imagen
    event.target.src = segundaOpcionURL;
  }

}
