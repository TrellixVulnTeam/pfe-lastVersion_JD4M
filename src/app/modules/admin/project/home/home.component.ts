import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Program } from 'app/models/Program';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { AuthenComponent } from '../user/authen/authen.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slides = [
    {'image': 'https://img.freepik.com/photos-gratuite/belle-matinee-au-lac-pang-ung-province-pang-ung-mae-hong-son-thailande_335224-933.jpg?w=2000'}, 
    {'image': 'https://media.cntraveler.com/photos/607313c3d1058698d13c31b5/3:2/w_2454,h_1636,c_limit/FamilyCamping-2021-GettyImages-948512452-2.jpg'},
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
    {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}
  ];
  products : Program[];

  constructor(    private _matDialog: MatDialog,
    private productsService : ProductsService,
    ) {   
    }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products : Program[]) => {
      this.products = products;
     console.log("program",this.products)
console.log("length", products[products.length -1])
    }, (error: ErrorEvent) => {
    })
  }
  login(): void
  {
      this._matDialog.open(AuthenComponent, {
          autoFocus: false,
          height: '700px',

          

          
      });
  }
}


