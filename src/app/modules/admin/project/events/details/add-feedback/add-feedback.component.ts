import { Component, Inject, OnInit } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import { ProductsService } from 'app/__services/Event_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { Feedback } from 'app/models/Feedback';
import { Program } from 'app/models/Program';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export type DialogDataSubmitCallback<T> = (row: T) => void;

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss']
})
export class AddFeedbackComponent implements OnInit {
  
  id: string;
  feedback : Feedback
  value: number = 5;
  myDate = new Date();
  str: string;
  product : Program


  options: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: "Very poor" },
      { value: 2 },
      { value: 3, legend: "Fair" },
      { value: 4 },
      { value: 5, legend: "Average" },
      { value: 6 },
      { value: 7, legend: "Good" },
      { value: 8 },
      { value: 9 },
      { value: 10, legend: "Excellent" }
    ]
  };
  constructor(
    private productService : ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorageService : TokenStorageService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<AddFeedbackComponent>,
    private _matDialog: MatDialog,




  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id)
   


  }

  AddFeedback(message , stars  ) {
    console.log(message)
    this.feedback = new Feedback(message,stars)
    this.productService.AddFeedback(this.data.id,this.tokenStorageService.getUser().id,this.feedback).subscribe(data => {
      console.log("data",data)
      this.productService.setReloadFeedback(true);
      this._matDialog.closeAll();
    }, error => console.log(error)); 
    console.log(this.feedback)
    
   
  }
}
