import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { TokenStorageService } from 'app/__services/ token-storage.service';
import { ProductsService } from 'app/__services/products.service';
import { UsersService } from 'app/__services/users.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    defaultChecked2 : [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  creditCard = false;
  isLinear = false;
  id : string;
  user : Users;
value : any;
  product : Program;
  stripe;
  loading = false;
  confirmation;
  username : string;
  isLoggedIn = false;
  constructor(           private _formBuilder: FormBuilder,
    private productService : ProductsService,
          private tokenStorageService : TokenStorageService,
          private route: ActivatedRoute,private router: Router,
          private userService : UsersService,


    ) { 
      
    }

    ngOnInit(): void
    {
        // Subscribe to courses
           console.log("vale",this.value);
            this.id = this.route.snapshot.params['id'];
            
            this.productService.getProduct(this.id)
              .subscribe(data => {
                console.log(data)
                this.product = data;
              }, error => console.log(error));
              this.isLoggedIn = !!this.tokenStorageService.getToken();
  
              if (this.isLoggedIn) {
                const user = this.tokenStorageService.getUser();
                this.username = user.username;
                
  
  
                 
            
            
            }
            this.userService.getUser(this.tokenStorageService.getUser().id
            ).subscribe((users : Users) => {
                this.user = users;
                console.log("user",this.user)
                 
            }, (error: ErrorEvent) => {
            })
           

        }
        
}
