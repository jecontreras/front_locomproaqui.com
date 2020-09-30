import { Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatVideoComponent } from 'mat-video/lib/video.component';

@Component({
  selector: 'app-introduccion',
  templateUrl: './introduccion.component.html',
  styleUrls: ['./introduccion.component.scss']
})
export class IntroduccionComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  @ViewChild('video1') matVideo1: MatVideoComponent;
  @ViewChild('video2') matVideo2: MatVideoComponent;
  @ViewChild('video3') matVideo3: MatVideoComponent;
  video1: HTMLVideoElement;
  video2: HTMLVideoElement;
  video3: HTMLVideoElement;

  constructor(
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.tabs();
    setTimeout(()=> this.videoDatos(), 3000 );
  }

  tabs(){
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  videoDatos(){
    this.video1 = this.matVideo1.getVideoTag();
 
    // Use Angular renderer or addEventListener to listen for standard HTML5 video events
    
    // this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
    this.video1.addEventListener('ended', () => {
      console.log('video ended');
      this.isLinear = false;
    });

    this.video2 = this.matVideo2.getVideoTag();
    this.video2.addEventListener('ended', () => {
      console.log('video ended');
      this.isLinear = false;
    });

    this.video3 = this.matVideo3.getVideoTag();
    this.video3.addEventListener('ended', () => {
      console.log('video ended');
      this.isLinear = false;
    });

  }

  siguienteTermin(){

  }

}
