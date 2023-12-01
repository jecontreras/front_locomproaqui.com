import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { RechargeService } from 'src/app/servicesComponents/recharge.service';
import { environment } from 'src/environments/environment';
declare var ePayco: any;

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {
  
  listRecharge:any = [];
  loader:boolean = false;
  disabedPn:boolean = false;
  dataUser:any = {};
  keyEpayco = environment.keyEpayco;
  estadoPruebaPagos = environment.estadoPruebaPagos;

  
  constructor(
    private _recharge: RechargeService,
    public _tools: ToolsService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    this.getRecharge();
  }

  getRecharge(){
    this.loader = true;
    this._recharge.get( {} ).subscribe( res =>{
      this.listRecharge = res.data;
      this.loader = false;
    });
  }

  handleActivatePackage( item:any ){
    if( this.disabedPn ) return false;
    this.disabedPn = true;
    let data = {
      recarga: item.id,
      user: this.dataUser.id,
      valor: item.precio,
      codigo: this._tools.codigo()
    };
    this._recharge.createUser( data ).subscribe( res =>{
      this.nextEpayco( item, res );
    },()=> this.disabedPn = false );
  }

  nextEpayco( item:any, data ){ 
    let obj:any = {
        url: "https://recaudos.pagosinteligentes.com/CollectForm.aspx?Token=be3c7e95-5c30-47e3-9209-9e88a2e6f57d",
        otrourl: "https://publihazclick.s3.amazonaws.com/paquetes/19fd8728-c89b-44c7-951b-79dcbbace3ff.jpg",
        wester: "https://www.google.com.co/",
        imgwester: "https://www.viviendocali.com/wp-content/uploads/2017/10/Western-Union-en-bucaramanga.jpg",
        name: item.titulo,
        invoice: data.codigo,
        currency: 'cop',
        amount: item.precio,
        tax_base: '0',
        tax: '0',
        country: 'co',
        test: false,
        lang: 'eng',
        external: 'true',
        extra1: 'extra1',
        extra2: 'extra2',
        extra3: 'extra3',
        name_billing: this.dataUser.name + ' ' + this.dataUser.lastname,
        email_billing: this.dataUser.email,
        address_billing: this.dataUser.ciudad || 'cucuta',
        type_doc_billing: this.dataUser.tipdoc,
        mobilephone_billing: this.dataUser.celular,
        number_doc_billing: this.dataUser.celular
    };
    //console.log( obj)
    try {
      const handler: any = ePayco.checkout.configure({
        key: this.keyEpayco,
        test: this.estadoPruebaPagos
      })
        ;
      handler.open(obj);
    } catch (error) {
      console.log("************", error)
      this._tools.tooast("Eror en el proceso de compra");
    }

    setTimeout(()=>this.disabedPn = true, 3000 );
  }

}
