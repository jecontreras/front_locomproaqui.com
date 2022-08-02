import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2'
import * as _ from 'lodash';
import { CART } from '../interfaces/sotarage';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  loading: any;
  intervalo: number = 0;

  currency: any = { prefix: '$ ', align: 'left', thousands: '.', decimal: ',', precision: 0 };
  dataConfig:any = {};

  constructor(
    private snackBar: MatSnackBar,
    private _store: Store<CART>,
    public sanitizer: DomSanitizer
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.dataConfig = store.configuracion || {};
      if( !this.dataConfig.clInformacion ) this.dataConfig.clInformacion = "3506700802"
    });
  }

  async presentToast(mensaje: string, type = 'completado') {
    this.snackBar.open(mensaje, type, { duration: 5000 });
  }

  openSnack(message: string, type: string, config: any) {
    if (config) {
      this.snackBar.open(message, type, config);
    } else {
      this.snackBar.open(message, type, { duration: 5000 });
    }
  }
  basic(text: string) {
    Swal.fire(text)
  }
  basicIcons(text: any) {
    Swal.fire(
      text.header,
      text.subheader,
      text.icon || 'question'
    );
  }
  error(text: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: text.mensaje,
      footer: text.footer || '<a href>Why do I have this issue?</a>'
    });
  }
  tooast(text: any) {
    Swal.fire({
      position: text.position || 'top-end',
      icon: text.icon || 'success',
      title: text.title || 'Your work has been saved',
      showConfirmButton: text.show || false,
      timer: 3000
    });
  }
  confirm(text: any) {
    return Swal.fire({
      title: text.title || 'Are you sure?',
      text: text.detalle || "You won't be able to revert this!",
      icon: text.icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: text.confirColor || '#3085d6',
      cancelButtonColor: text.cancelColor || '#d33',
      confirmButtonText: text.confir || 'Aceptar!'
    });
  }

  alertInput( opciones ){
    return new Promise( resolve => {
      Swal.fire({
        title: opciones.title || 'Input',
        input: opciones.input || 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: opciones.confirme || 'Siguiente',
        showLoaderOnConfirm: true,
        preConfirm: ( txt ) => {
          return txt;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        resolve( result ) ;
      })
    });
  }

  ProcessTime(text: any) {
    let timerInterval
    Swal.fire({
      title: text.title || 'Cargando...',
      html: '',
      timer: text.tiempo || 3000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
          }
        }, 1000)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }

  async descargarFoto(url: string) {
    this.intervalo++;
    let nombre = this.codigo() + this.intervalo;
    console.log(nombre)
    return new Promise(resolve => {
      let urlFormato = _.split(url, ";base64,", 10);
      let byteCharacters = atob(urlFormato[1]);
      let byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      let blob = new Blob([byteArray], { "type": "image/jpeg" });

      if (navigator['msSaveBlob']) {
        let filename = 'picture';
        navigator['msSaveBlob'](blob, filename);
      } else {
        let link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.setAttribute('visibility', 'hidden');
        link.download = nombre || 'pictures';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      resolve(true);
    })
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  calcularDistancia(params: any) {

    let latitud1: any = params.latitud1;
    let longitud1: any = params.longitud1;
    let latitud2: any = params.latitud2;
    let longitud2: any = params.longitud2;
    let unidad_metrica: any = String();

    let distancia: any = Number();
    let radius: any = Number();
    radius = 6378.137;

    let deg2radMultiplier = Number();
    deg2radMultiplier = Math.PI / 180;

    latitud1 = latitud1 * deg2radMultiplier;
    longitud1 = longitud1 * deg2radMultiplier;

    latitud2 = latitud2 * deg2radMultiplier;
    longitud2 = longitud2 * deg2radMultiplier;

    let dlongitud = Number();
    dlongitud = longitud2 - longitud1;

    distancia = Math.acos(Math.sin(latitud1) * Math.sin(latitud2) + Math.cos(latitud1) *
      Math.cos(latitud2) * Math.cos(dlongitud)) * radius;

    if (unidad_metrica) unidad_metrica = 'M';
    distancia = distancia * 1000;

    return distancia;

  }

  monedaChange(cif = 3, dec = 2, valor: any) {
    // tomamos el valor que tiene el input
    //  console.log(valor, cif, dec)
    if (!valor) return 0;
    let inputNum = valor;
    // Lo convertimos en texto
    inputNum = inputNum.toString()
    // separamos en un array los valores antes y después del punto
    inputNum = inputNum.split('.')
    // evaluamos si existen decimales
    if (!inputNum[1]) {
      inputNum[1] = '00'
    }

    let separados
    // se calcula la longitud de la cadena
    if (inputNum[0].length > cif) {
      let uno = inputNum[0].length % cif
      if (uno === 0) {
        separados = []
      } else {
        separados = [inputNum[0].substring(0, uno)]
      }
      let numero: number = Number(inputNum[0].length);
      let posiciones = Number(numero / cif)
      for (let i = 0; i < posiciones; i++) {
        let pos = ((i * cif) + uno)
        // console.log(uno, pos)
        if (inputNum[0] == "") continue;
        separados.push(inputNum[0].substring(pos, (pos + 3)))
      }
    } else {
      separados = [inputNum[0]]
    }
    separados = separados.filter((row: any) => row != "");
    return '$' + separados.join(".") + ' COP'; //+ ',' + inputNum[1];
  }

  seguridadIfrane( url:string ){
    return this.sanitizer.bypassSecurityTrustResourceUrl( url );
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf'});
    return blob;
  }

  downloadPdf(base64String, fileName){

    // data should be your response data in base64 format
    
    const blob = this.dataURItoBlob( base64String );
    const urls = URL.createObjectURL(blob);
    
    // to open the PDF in a new window
    window.open(urls, '_blank');
    if(window.navigator && window.navigator['msSaveOrOpenBlob']){
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : 'application/pdf'});
      window.navigator['msSaveOrOpenBlob'](blob, `${fileName}.pdf`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}.pdf`
      //link.click();
    }
  }

  downloadIMG( ImageBase64:string ){
    var a = document.createElement("a"); //Create <a>
    a.href = "data:image/png;base64," + ImageBase64; //Image Base64 Goes here
    a.download = "Image.png"; //File name Here
    a.click(); //Downloaded file
  }

  converBase64ImgToBynare( dataurl, filename ){
    var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], filename, {type:mime});
  }


}
