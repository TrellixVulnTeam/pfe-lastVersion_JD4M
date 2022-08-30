import { fuseAnimations } from '@fuse/animations';
import { tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Program } from 'app/models/Program';
import { ProductsService } from 'app/__services/Event_services/products.service';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.scss'],
  animations: fuseAnimations

})
export class ManageEventsComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  isLoading = false;
  searchInputControl: FormControl = new FormControl();
  selectedEvent: any | null = null;
  products: Program[];


  searchText: string;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private productsService: ProductsService,
    ) { }

  ngOnInit(): void {
    this.productsService.getByStatus("isPending").subscribe((products: Program[]) => {
      this.products = products.reverse();
      console.log("program", this.products)
      
  
    }, (error: ErrorEvent) => {})

    this.searchInputControl.valueChanges
      .pipe(
        tap(search => {
          console.log('search ->', search)
          const searchTerm = search.trim().toLowerCase();
          this.searchText = searchTerm;
        })
      ).subscribe();
    
    
  }

  toggleDetails(eventId: string): void {
    // If the product is already selected...
    if (this.selectedEvent && this.selectedEvent.id === eventId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the product by id
    const event = this.products.find(el => el.id === eventId);
    this.selectedEvent = event;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedEvent = null;
  }

  manageEvent(eventId: string, status: string) {
    const event = this.products.find(el => el.id === eventId);
    (event as any).status = status;
    if (status === 'accepted') {
      this.productsService.acceptEvents(eventId).subscribe((products: Program) => {
        console.log("program", products)
        this.products = this.products.filter(el => el.id !== eventId);
      ;
      });
    }
    if (status === 'refused') {
      this.productsService.refuseEvents(eventId).subscribe((products: Program) => {
        console.log("program", products)
        this.products = this.products.filter(el => el.id !== eventId);

        ;
      });
    }
    console.log('event -->', event);
  }

}
