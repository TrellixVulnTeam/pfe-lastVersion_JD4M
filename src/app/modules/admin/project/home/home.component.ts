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
  products : Program[];
    products2 : Program[];


    /**
     * Constructor
     */
    constructor(    private productsService : ProductsService,
    
      )
    {
    }


    ngOnInit(): void {
      this.productsService.getProducts().subscribe((products : Program[]) => {
        this.products = products;
        this.products2 = this.products.reverse().slice(1,4);
       console.log("program",this.products2)
  console.log("length", products[products.length -1])
      }, (error: ErrorEvent) => {
      })
    }

}


