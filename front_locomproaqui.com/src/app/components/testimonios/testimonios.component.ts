import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';
import { NgxSpinnerService } from 'ngx-spinner';


const URLFRON = environment.urlFront;

@Component({
  selector: 'app-testimonios',
  templateUrl: './testimonios.component.html',
  styleUrls: ['./testimonios.component.scss']
})
export class TestimoniosComponent implements OnInit {

  listRow:any = [];
  urlRegistro:string = `${ URLFRON }/registro/`;
  query:any = {
    where:{
      estado: 0
    },
    page: 0,
    limit: 15
  };
  dataUser:any = {};

  constructor(
    private _testimonios: TestimoniosService,
    private spinner: NgxSpinnerService
  ) { 
  }

  ngOnInit(): void {
    this.getRow();
  }

  getRow(){
    this.spinner.show();
    this._testimonios.get( this.query ).subscribe(( res:any )=>{
      this.listRow = res.data;
      this.spinner.hide();
    });
  }

}
