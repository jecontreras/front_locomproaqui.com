import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-catalago-proveedor',
  templateUrl: './ver-catalago-proveedor.component.html',
  styleUrls: ['./ver-catalago-proveedor.component.scss']
})
export class VerCatalagoProveedorComponent implements OnInit {
  sear:any = {
    opt: "",
    text: ""
  };
  listTendencia:any = [
    {
      id: 1,
      precio: "COP 22,500",
      titulo: "fibra natural, colon + plus 450g",
      descripcion: "sicommer",
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Productos/8335.jpg"
    }
  ];
  listDestacados:any = [
    {
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/3403.jpg",
      id: 1
    },
    {
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/3403.jpg",
      id: 2
    },
    {
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/3403.jpg",
      id: 3
    },
    {
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/3403.jpg",
      id: 4
    },
    {
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Tiendas/3403.jpg",
      id: 5
    },
  ];
  listRecomendados:any = [
    {
      id: 1,
      precio: "COP 22,500",
      titulo: "fibra natural, colon + plus 450g",
      descripcion: "sicommer",
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Productos/8335.jpg"
    }
  ];
  listRentables:any = [
    {
      id: 1,
      precio: "COP 22,500",
      titulo: "fibra natural, colon + plus 450g",
      descripcion: "sicommer",
      foto: "https://triidyftp.s3.us-east-2.amazonaws.com/Productos/8335.jpg"
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

  buscarFTP(){

  }

}
