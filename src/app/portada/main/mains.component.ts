import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { CART } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-mains',
  templateUrl: './mains.component.html',
  styleUrls: ['./mains.component.scss']
})
export class MainsComponent implements OnInit {
  data:any = {};
  id:string;
  view:string;
  view2:string;

  constructor(
    private _store: Store<CART>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      if( store.usercabeza ) this.data = store.usercabeza || {}
    });

  }

  ngOnInit() {
    this.view = location.pathname;
    this.view2 = ( this.view.split("/") )[2];
  }

}
