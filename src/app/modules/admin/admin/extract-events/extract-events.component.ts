import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';

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
  isLoggedIn = false;
  username : string;
  role :string;
  constructor(private cdr: ChangeDetectorRef,
    private productService: ProductsService,
    private tokenStorageService: TokenStorageService,

    ) { }

  ngOnInit(): void {    
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const userConnected = this.tokenStorageService.getUser();
      this.username = userConnected.username;
      const roles = this.tokenStorageService.getUser().roles;
      if (roles.includes('ROLE_USER')) {
          this.role = 'ROLE_USER';
      }
      if (roles.includes('ROLE_ADMIN')) {
          this.role = 'ROLE_ADMIN';
      } 
    }
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
