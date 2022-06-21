import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Program } from 'app/models/Program';
import { ProductsService } from 'app/__services/products.service';
import { AuthenComponent } from '../authen/authen.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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


