import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    Location,
    GermanAddress,
  } from '@angular-material-extensions/google-maps-autocomplete';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { Program } from 'app/models/Program';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
    selector     : 'example',
    templateUrl  : './project.component.html',
    styleUrls: ['./project.component.scss'],

    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent implements OnInit
{
   
  products: Program[];
  products2: Program[];
  searchPrograms = [];
  searchForm = this.fb.group({
    destination: '',
    date: ''
  });

  /**
   * Constructor
   */
  constructor(private productsService: ProductsService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,



  ) {
  }


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products: Program[]) => {
      this.products = products;
      this.products2 = this.products.reverse().slice(0, 4);
      console.log("program", this.products2)
      console.log("length", products[products.length - 1])
    }, (error: ErrorEvent) => {
    })
  }


  search() {
    console.log('search ->', this.searchForm.value);
    this.searchPrograms = this.products;
    console.log('searchPrograms ->', this.searchPrograms);
    const searchDestination = this.searchForm.value['destination'].trim().toLowerCase();
    const searchDate = this.searchForm.value['date'];
    this.searchPrograms.map(program => program.date = this.datePipe.transform(new Date(program.cree), "yyyy-MM-dd"));
    this.searchPrograms = this.searchPrograms.filter((program) => program.title.includes(searchDestination) || program.date.includes(searchDate));
    console.log('programs + filter ->', this.searchPrograms);
    this.productsService.setSearch(this.searchPrograms);
    this.router.navigate(['/events/list']);
    this.reminder()
  }

  reminder() {
    const programs = this.products.filter(program => program.participant.length);
    programs.map(program => {
      if (program.id === '62e7d10c7a12c10a5b01b4cb') {
        program.cree = new Date('2022-08-24');
      }
      if (this.isTomorrow(program.cree)) {
        program.participant.map(el => {
          el.notif = {
            msg: 'you have program tomorrow'
          }
        })
      }
    })
    console.log('reminder ->', programs);
  }

  isTomorrow(searchedDate: Date) {
    let date = new Date();
    let date_tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    let programDate = new Date(searchedDate);
    if (date_tomorrow.getFullYear() == programDate.getFullYear() && date_tomorrow.getMonth() == programDate.getMonth() && date_tomorrow.getDate() == programDate.getDate()) {
      return true;
    } else {
      return false;
    }
  }

}

