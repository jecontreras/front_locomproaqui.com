import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-size-dialog',
  templateUrl: './select-size-dialog.component.html',
  styleUrls: ['./select-size-dialog.component.scss']
})
export class SelectSizeDialogComponent implements OnInit {
  selectedOption: string;
  options: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];
  constructor() { }

  ngOnInit(): void {
  }

}
