import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'app/models/Users';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UserService } from 'app/__services/user_services/user.service';
import { UsersService } from 'app/__services/user_services/users.service';

@Component({
  selector: 'app-cart-profile',
  templateUrl: './cart-profile.component.html',
  styleUrls: ['./cart-profile.component.scss']
})
export class CartProfileComponent implements OnInit {

  user: Users;
  id : string; 
  constructor(
    private tokenStorageService : TokenStorageService,
    private route: ActivatedRoute,private router: Router,
    private userService : UsersService,) { 

    
   }

  ngOnInit(): void {
 
    this.id = this.route.snapshot.params['id'];
    console.log("id",this.id)
    this.userService.getUser(this.id
      ).subscribe((users : Users) => {
          this.user = users;
          console.log("userProfile",this.user)
           
      }, (error: ErrorEvent) => {
      })


  }

}
