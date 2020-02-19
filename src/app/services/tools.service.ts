import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  
  loading:any;

  constructor(
    private _snackBar: MatSnackBar
  ) { }
 
  async presentToast(mensaje:string) {
    this._snackBar.open(mensaje);
  }

}
