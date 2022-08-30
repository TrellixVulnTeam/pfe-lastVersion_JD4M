import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/__services/Event_services/products.service';

@Component({
  selector: 'app-extract-events',
  templateUrl: './extract-events.component.html',
  styleUrls: ['./extract-events.component.scss']
})
export class ExtractEventsComponent implements OnInit {

  isLoading = false;
  isExtractMode = false;
  isProgress = false;
  displayList = false;
  extractedEvents = [];
  isCompleted = false;
  constructor(private cdr: ChangeDetectorRef,
    private productService: ProductsService,
    ) { }

  ngOnInit(): void {    
  }

  saveEvents() {
    this.extractedEvents.map((event, index) => {
      this.productService.addProduct(event).then(res => {
        console.log(event)     
      });
      if (index === this.extractedEvents.length - 1) {
          this.isCompleted = true;
          this.displayList = false;
        }}); 
      }

  extractEvents() {
    this.isExtractMode = true;
    this.productService.getExtractedEvents()
      .subscribe(
        (response) => {
          this.displayList = true;

          this.extractedEvents = response;
           this.cdr.markForCheck();
          console.log("response2", this.extractEvents)



            }, error => console.log(error));
  }

  extractEventInProgress() {
    console.log('displayList ->', this.displayList);
  }

}
