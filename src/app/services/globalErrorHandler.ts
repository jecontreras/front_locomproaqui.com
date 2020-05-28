import { ErrorHandler, Injectable} from '@angular/core';
import { ToolsService } from './tools.service';
// import { ToolsService } from './tools.service';
// import { AuthService } from './auth.service';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
      private _tools: ToolsService,
      // private _auth: AuthService
  ) { }
  handleError(error) {
    console.log('Hio', error.statusText)
      if(error.statusText == "Forbidden") {
        this._tools.basicIcons({ icon: "error", header: "Error de Sesión ", subheader: "Lo sentimos tu token esta caducado"})
        setTimeout(()=>{
        localStorage.removeItem('APP');
        localStorage.removeItem('user');
        location.reload();
        }, 5000);
      }
      //    this._tools.basicIcons({ icon: "error", header: "Error de Sesión ", subheader: "Lo sentimos tu token esta caducado"})
      //    setTimeout(()=>{
      //        this._auth.deleteStorages();
      //    }, 3000);
      // }
     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
  }
  
}