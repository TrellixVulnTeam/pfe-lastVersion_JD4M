import { Options } from '@angular-slider/ngx-slider';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'app/models/Feedback';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';

@Component({
  selector: 'app-edit-feedback',
  templateUrl: './edit-feedback.component.html',
  styleUrls: ['./edit-feedback.component.scss']
})
export class EditFeedbackComponent implements OnInit {

 
  id: string;
  feedback : Feedback
  value: number = 5;
  myDate = new Date();
  str: string;
  product : Program
  feedbacks : any
  userF : any;
  EditFeedback;



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
    private userService: UsersService,
    private _formBuilder: FormBuilder,






  ) { }

  ngOnInit(): void {

    

    console.log("id",this.data.id)
    this.productService.getProduct(this.data.id)
    .subscribe(data => {
      console.log(data)
      this.product = data;
      
    }, error => console.log(error));
   this.getFeedbacks()
   


  }
/*
  editFeedback(id  :  string, value : any) {
    
  this.productService.editFeedback(id,value)
  .subscribe(
    data => {
      console.log(data);
    },
    error => console.log(error));
    
   
  } */

  getFeedbacks() {
    this.productService.getFeedbacks(this.data.id).subscribe(data => {
      this.feedbacks = data
      console.log("feedbacks", this.feedbacks)
      for (let i = 0; i < this.feedbacks.length; i++) {
         this.value = this.feedbacks[i].stars;
         this.str = this.feedbacks[i].message
         console.log("value" ,this.value,this.str)
         this.EditFeedback = this._formBuilder.group({
          value   : this.value,
          str: this.str,
      })
    
      }
    });
  }
  deleteFeedback( id: string, value : any) {
    this.productService.deleteFeedback(id,value)
      .subscribe(
        data => {
          console.log(data);
        });
}
onSubmit() {
  console.log(this.id)
  console.log(this.product.id)
  this.productService.getFeedbacks(this.data.id).subscribe(data => {
    this.feedbacks = data
    console.log("feedbacks", this.feedbacks)
    for (let i = 0; i < this.feedbacks.length; i++) {
     
       console.log("value" ,this.value,this.str)
       this.EditFeedback = this._formBuilder.group({
        stars   : this.value,
        message: this.str,
        
    })
    
    console.log( Number(this.feedbacks.indexOf(this.feedbacks[i])), this.EditFeedback.value)
    this.productService.editFeedback(this.data.id,Number(this.feedbacks.indexOf(this.feedbacks[i])), this.EditFeedback.value)
    .subscribe(
      data => {
        console.log(data);
        this.productService.setReloadFeedback(true);
        this._matDialog.closeAll();
      
  
  
      },
      error => console.log(error));
    }
    
  });
    console.log(this.EditFeedback.value)

 

}
}
