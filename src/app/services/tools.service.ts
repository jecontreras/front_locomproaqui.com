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
      footer: text.footer || ''
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
      title: text.title || '',
      text: text.detalle || "",
      icon: text.icon || 'warning',
      showCancelButton: text.showCancel || true,
      confirmButtonColor: text.confirColor || '#3085d6',
      cancelButtonColor: text.cancelColor || '#d33',
      confirmButtonText: text.confir || 'Aceptar!',
      cancelButtonText: text.cancel || 'Cancelar!'
    });
  }

  alertInput( opciones ){
    return new Promise( resolve => {
      Swal.fire({
        title: opciones.title || 'Input',
        input: opciones.input || 'text',
        inputValue: opciones.value || '',
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

  processPhoto( data ){
    Swal.fire({
      imageUrl: data.photo || 'https://placeholder.pics/svg/300x1500',
      imageHeight: 500,
      imageAlt: data.title || 'A tall image'
    })
  }

  openFotoAlert( foto:string ){
    Swal.fire({
      title: '',
      text: '',
      imageUrl: foto,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: '',
    })
  }

  ProcessTime(text: any) {
    let timerInterval
    Swal.fire({
      title: text.title || 'Cargando...',
      html: '',
      timer: text.tiempo || 6000,
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
    return '$' + separados.join("."); //+ ',' + inputNum[1];
  }
  monedaChange2(cif = 3, dec = 2, valor: any) {
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
    return separados.join("."); //+ ',' + inputNum[1];
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

  getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
   });
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

  getScrollRoot(){
    var html = document.documentElement, body = document.body,
        cacheTop:any = ((typeof window.pageYOffset !== "undefined") ? window.pageYOffset : null) || body.scrollTop || html.scrollTop, // cache the window's current scroll position
        root;

    html.scrollTop = body.scrollTop = cacheTop + (cacheTop > 0) ? -1 : 1;
    // find root by checking which scrollTop has a value larger than the cache.
    root = (html.scrollTop !== cacheTop) ? html : body;

    root.scrollTop = cacheTop; // restore the window's scroll position to cached value

    return root; // return the scrolling root element
  }

  handleCopyHolder( url:string ){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnack('Copiado:' + ' ' + url, 'completado', false);
  }

    // Facebook share won't work if your shareUrl is localhost:port/abc, it should be genuine deployed url
    shareOnFacebook(shareUrl: string) {
      shareUrl = encodeURIComponent(shareUrl);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, 'sharer');
    }

    shareOnPinterest(shareUrl: string, img: string, desc: string) {
      shareUrl = encodeURIComponent(shareUrl);
      img = encodeURIComponent(img);
      desc = encodeURIComponent(desc);
      window.open(`https://www.pinterest.com/pin/create/button?url=${shareUrl}&media=${img}&description=${desc}`, 'sharer');
    }

    shareOnTwitter(shareUrl: string, desc: string) {
      shareUrl = encodeURIComponent(shareUrl);
      desc = encodeURIComponent(desc);
      window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${desc}`, 'sharer');
    }

    shareOnGooglePlus(shareUrl: string) {
      shareUrl = encodeURIComponent(shareUrl);
      window.open(`https://plus.google.com/share?url=${shareUrl}`, 'sharer');
    }

    // LinkedIn share won't work if your shareUrl is localhost:port/abc, it should be genuine deployed url
    shareOnLinkedIn(shareUrl: string, title: string, summary: string) {
      shareUrl = encodeURIComponent(shareUrl);
      window.open(`https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${title}&summary=${summary}`, 'sharer');
    }

    print() {
      let printContents, popupWin;
      printContents = document.getElementById("print").innerHTML.toString();
      printContents = (<string>printContents + "").replace("col-sm", "col-xs");
      // console.log(printContents);
      popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Reporte</title>
            <meta name="viewport" content="width=10000, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            <style>
              .salto_pagina_despues{
                page-break-after:always;
              }

              .salto_pagina_anterior{
                page-break-before:always;
              }

              .content {
                height: 100vh;
                width: 100%;
                display: flex;
                flex-direction: column;
              }

              .img-content {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .observation {
                height: 150px;
                overflow: hidden;
                overflow-y: auto;
              }
            </style>
          </head>
          <body onload="window.print();">
            ${printContents}
          </body>
        </html>`);
      /* window.close(); */
      popupWin.document.close();
    }


}
