import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolsService } from 'src/app/services/tools.service';
import { AdminService } from 'src/app/servicesComponents/admin.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  data:any = {};
  file:any = {
    foto1: []
  };
  btnDisableFile:boolean = false;

  constructor(
    private _archivo: ArchivosService,
    private _tools: ToolsService,
    private _admin: AdminService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  async datafiles( opt, ev ){
    try {
      this.file.foto1 = ev.target.files;
      if( !this.file.foto1[0] ) return false;
      // this.data[opt] = await this._archivo.getBase64(this.file.foto1[0]);
      // this.data[opt] = this.sanitizer.bypassSecurityTrustResourceUrl( this.data[opt] )
    } catch (error) {}
  }
  async subirFile( opt ){
    return new Promise(resolve => {
      if( this.btnDisableFile ) return resolve( true );
      this.btnDisableFile = true;
      let form: any = new FormData();
      form.append('file', this.file.foto1);
      this._tools.ProcessTime({});
      this._archivo.create(form).subscribe((res: any) => {
        //console.log(form);
        this.btnDisableFile = false;
        this._tools.tooast({ title: "subido exitoso" });
        this.data[opt] = res.files;
        this.actualizarDatos();
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); this.btnDisableFile = false; resolve( false ) })
    });
  }

  async actualizarDatos(){
    this._admin.update( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Actualizado" } );
    },error => this._tools.tooast( { title: 'Error' } ) );
  }

}
