import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2'
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  loading: any;

  constructor(
    private snackBar: MatSnackBar
  ) { }

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
      timer: 1500
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
      confirmButtonText: text.confir || 'Yes, delete it!'
    });
  }
  ProcessTime(text: any) {
    let timerInterval
    Swal.fire({
      title: text.title || 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
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

  async descargarFoto(url: string, nombre:string) {
    return new Promise(resolve=>{
      let urlFormato = _.split(url, ";base64,", 10);
      let byteCharacters = atob(urlFormato[1]);
      let byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      let blob = new Blob([byteArray], { "type": "image/jpeg" });

      if (navigator.msSaveBlob) {
        let filename = 'picture';
        navigator.msSaveBlob(blob, filename);
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


}
