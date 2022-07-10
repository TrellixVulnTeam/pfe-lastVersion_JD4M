import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    Location,
    GermanAddress,
  } from '@angular-material-extensions/google-maps-autocomplete';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { Program } from 'app/models/Program';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector     : 'example',
    templateUrl  : './project.component.html',
    styleUrls: ['./project.component.scss'],

    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent implements OnInit
{
   
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
        this.products2 = this.products.reverse().slice(0,4);
       console.log("program",this.products2)
  console.log("length", products[products.length -1])
      }, (error: ErrorEvent) => {
      })
    }


   
      
}
