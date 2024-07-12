import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-dialog-location',
  templateUrl: './alert-dialog-location.component.html',
  styleUrls: ['./alert-dialog-location.component.scss']
})
export class AlertDialogLocationComponent{

  constructor(public dialogRef: MatDialogRef<AlertDialogLocationComponent>) { }

  onAllow() {
    this.dialogRef.close(true);
  }

  onDeny() {
    this.dialogRef.close(false);
  }
}
