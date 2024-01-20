import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { ActivatedRoute } from '@angular/router';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { CartAction } from 'src/app/redux/app.actions';


@Component({
  selector: 'app-ver-producto-proveedor',
  templateUrl: './ver-producto-proveedor.component.html',
  styleUrls: ['./ver-producto-proveedor.component.scss']
})
export class VerProductoProveedorComponent implements OnInit {
  
  titulo: string = "";
  data:any = {};
  urlFoto:string;
  mySlideImages = [];
  imageObject: any = [];
  id:any;

  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  sliderWidth: Number = 300;
  sliderImageWidth: Number = 90;
  sliderImageHeight: Number = 100;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  galeria:any = [];
  dataUser:any = {};
  seleccionoColor:any = {};
  seleccionnTalla:any = {};
  numeroAleatori:number = 0;
  idProveedor:any;

  constructor(
  	private _producto: ProductoService,
    private activate: ActivatedRoute,
    public _tools: ToolsService,
    private _store: Store<CART>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.dataUser = store.user || {};
    });

  }

  ngOnInit(): void {
  	
  	if( this.activate.snapshot.paramMap.get('id')){
       this.id = ( this.activate.snapshot.paramMap.get('id') );
       this.getArticulo();
  	}

    this.numeroAleatori = parseInt( this.getRandomArbitrary(1, 1000) )

  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  getArticulo(){
  	this._producto.get( { where: { id: this.id } } ).subscribe( ( res:any ) =>{
  		this.data = res.data[0] || {};
      this.titulo = this.data.pro_usu_creacion.usu_usuario || 'Empresa';
      this.idProveedor = this.data.pro_usu_creacion.id;
      this.urlFoto = this.data.foto;
      console.log( this.data )
      this.data.ganancia = Number( this.data.pro_uni_venta - this.data.pro_vendedor );
      this.data.listColor.filter(( item:any )=> {
        item.tallaSelect = item.tallaSelect.filter(( row:any ) => Number( row.cantidad ) > 0 );
        if( item.galeriaList ) this.galeria.push( ... item.galeriaList );
        return true;
      } );
      for( let row of this.galeria ) this.imageObject.unshift({
        //image: row.foto,
        thumbImage: row.foto,
        alt: '',
        check: true,
        id: 0,
      });
  	});
  }

  async AgregarCart( opt:any ){
    if(  this.seleccionnTalla.cantidad < this.data.cantidadAdquirir ) return this._tools.tooast({ title: "Lo sentimos en estos momento no tenemos en stock", icon: "warning" });
    if (!this.data.tallas) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    let color = '';
    let cantidad = this.data.cantidadAdquirir || 1;
    let precio = this.data.pro_vendedor || this.data.pro_uni_venta;
    if( this.data.listColor ) { this.data.color = this.data.listColor.find(row=>row.foto = this.data.foto) || {}; color = this.data.color.talla }
    if(opt) { opt.selecciono = true; this.suma( opt.precios , opt.cantidad ); cantidad = opt.cantidad; precio = opt.precios; }
    else this.suma( ( this.data.pro_vendedor || this.data.pro_uni_venta ) , this.data.cantidadAdquirir );
    let encuanto:any = this.data.pro_uni_venta;
    /*if( this.data.pro_vendedor && !this.data.encuanto ){
      encuanto = await this._tools.alertInput( { title: "Encuanto lo vendio", input: 'text', confirme: "Agregar"} );
      if( !encuanto.value ) return this._tools.tooast({ title: "Por Favor debes decirnos en cuanto lo vendiste", icon: "warning" });
      encuanto = encuanto.value;
    }else{
      encuanto = this.data.encuanto || precio;
    }*/
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      color: color,
      tallaSelect: this.data.tallas || 'default',
      foto: this.urlFoto,
      cantidad: cantidad,
      costo: precio,
      loVendio: encuanto,
      costoTotal: this.data.costo,
      id: this._tools.codigo(),
      precioReal: this.data.pro_uni_venta
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
  }

  suma( numero:any, cantidad:any ){
    this.data.costo = Number( cantidad ) * Number( numero );
  }

  imageOnClick(index: any) {
    //con
    this.urlFoto = this.imageObject[index].thumbImage;
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

  eventoFoto( event ){
    //console.log( event )
  }

  colorSeleccionado(){
    try {
      if( !this.data.color ) return this.procesoNext();
      if( this.data.color == 'null' ) return this.procesoNext();
      this.data.tallas = "";
      this.seleccionnTalla = {};
      this.seleccionoColor = this.data.listColor.find( row => row.talla == this.data.color );
      this.llenadoGaleria();  
      this.seleccionTalla();
      this.cambioImgs();
    } catch (error) {}
  }

  seleccionTalla(){
    try {
      //console.log( this.data );
      if( !this.data.tallas ) return false;
      this.seleccionnTalla = this.seleccionoColor.tallaSelect.find( row => row.tal_descripcion == this.data.tallas );
      //console.log( this.seleccionnTalla );
    } catch (error) { console.log( error ); }
  }

  llenadoGaleria(){
    this.imageObject = [];
    this.imageObject.push( 
      {
        //image: this.seleccionoColor.foto,
        thumbImage: this.seleccionoColor.foto,
        alt: '',
        check: true,
        id: 0,
      }
    );
    for( let row of this.seleccionoColor.galeriaList ) this.imageObject.unshift({
      //image: row.foto,
      thumbImage: row.foto,
      alt: '',
      check: true,
      id: 0,
    });
  }

  cambioImgs(){
    //console.log( this.seleccionoColor );
    this.urlFoto = this.seleccionoColor.foto;
    //console.log( this.urlFoto );
  }

  procesoNext(){
    if( !this.galeria ) this.galeria || [];
    this.galeria = [];
      this.galeria.push( {
        id: this._tools.codigo(),
        foto: this.data.foto
      });
      console.log(this.data);
      if( this.data.listColor ) if( this.data.listColor.length ) this.data.listColor = this.data.listColor.filter(( item:any )=> {
        item.tallaSelect = item.tallaSelect.filter(( row:any ) => Number( row.cantidad ) > 0 );
        if( item.galeriaList ) this.galeria.push( ... item.galeriaList );
        return true;
      } );
      //this.data.cantidadAdquirir = 1;
      this.llenandoGaleria();
      for( let row of this.galeria ) this.imageObject.unshift({
        //image: row.foto,
        thumbImage: row.foto,
        alt: '',
        check: true,
        id: 0,
      });
  }

  llenandoGaleria(){
    try {
      for( let row of this.data.listColor )
      this.galeria.push({ id: row.id, foto: row.foto });
    } catch (error) {}
  }





}
