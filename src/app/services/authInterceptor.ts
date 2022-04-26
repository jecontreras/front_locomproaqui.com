import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { USER } from '../interfaces/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    token:string = "";
    constructor(
        private _store: Store<USER>,
    ) {
        this._store.select("name")
        .subscribe((store: any) => {
            if(!store) return false;
            if( store.token ) if( Object.keys(store).length > 0 ) this.token = store.token.token;
        });
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log("*******", this.token);
        req = req.clone({
            setHeaders: {
                //'Content-Type': 'application/json; charset=utf-8',
                //'Accept': 'application/json',
                'authorization': this.token || 'Bearer',
            },
        });

        return next.handle(req);
    }
}