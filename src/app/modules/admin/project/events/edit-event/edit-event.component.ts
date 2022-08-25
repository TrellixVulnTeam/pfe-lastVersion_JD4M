import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Program } from 'app/models/Program';
import { ProductsService } from 'app/__services/Event_services/products.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  event: Program
  minDate = new Date();
  EditEvent: FormGroup;
  product: Program;
  id: string;

  maxDate = new Date(2024,0,1);
  constructor(private route: ActivatedRoute, private router: Router,
    private _formBuilder: FormBuilder,
    private productService: ProductsService,

    ) { }

  ngOnInit(): void {

    this.EditEvent = this._formBuilder.group({
      title   : [''],
      description : [''],
      type: [''],
      price: [''],
      date:['']

  })
  this.id = this.route.snapshot.params['id'];
  this.productService.getProduct(this.id)
    .subscribe(data => {
      console.log(data)
      this.product = data;
      this.EditEvent = this._formBuilder.group({
        title   : this.product.title,
        description : this.product.description,
        type: this.product.type,
        price: this.product.prices,
        date: this.product.date
  
    })
    }, error => console.log(error));


  }

  onSubmit() {
    console.log(this.id)
    console.log(this.product.id)

    this.productService.editEvent(this.product.id, this.EditEvent.value)
    .subscribe(
      data => {
        console.log(data);
      


      },
      error => console.log(error));
      this.router.navigate(['/events/list'])

  }

}
