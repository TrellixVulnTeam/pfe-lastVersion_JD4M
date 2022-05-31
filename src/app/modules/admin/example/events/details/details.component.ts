import { ChangeDetectorRef, Component, OnInit, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Program } from 'app/models/Program';
import { TokenStorageService } from 'app/__services/ token-storage.service';
import { ProductsService } from 'app/__services/products.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
   
  
  
    latitudedef: number = 35.825603;
    latitude: any;
    longitude: any;
    longitudedef: number = 10.608395;
    form: FormGroup;
    location: Location;
    eventWithPlace : any;
    animationDirection: 'left' | 'right' | 'none';
      currentStep: number;
      isLoggedIn = false;
      username :string;
      id: string;
      product: Program;
      participants : any[];

    
    markers: marker[] = [
      {
        latitude: this.latitudedef,
  
        longitude: this.longitudedef,
        label: 'your place',
      },
    ];
  
   
    
    
    
      
  
      // Private
  
      /**
       * Constructor
       *
       * @param {AcademyCourseService} _academyCourseService
       * @param {ChangeDetectorRef} _changeDetectorRef
       * @param {FuseSidebarService} _fuseSidebarService
       */
      constructor(private route: ActivatedRoute,private router: Router,
          private _changeDetectorRef: ChangeDetectorRef,
          private productService : ProductsService,
          private tokenStorageService : TokenStorageService,
  
      )
      {
          // Set the defaults
          this.animationDirection = 'none';
          this.currentStep = 0;
  
          // Set the private defaults
         
      }
  
      // -----------------------------------------------------------------------------------------------------
      // @ Lifecycle hooks
      // -----------------------------------------------------------------------------------------------------
  
      /**
       * On init
       */
      ngOnInit(): void
      {
          // Subscribe to courses
        
              this.product = new Program();
  
              this.id = this.route.snapshot.params['id'];
              
              this.productService.getProduct(this.id)
                .subscribe(data => {
                  console.log(data)
                  this.product = data;
                }, error => console.log(error));
                this.isLoggedIn = !!this.tokenStorageService.getToken();
   
                if (this.isLoggedIn) {
                  const user = this.tokenStorageService.getUser();
                  this.username = user.username;
                  
  
  
                this.productService.getPartcipants(this.id).subscribe((participants : any[]) => {
                  this.participants = participants;
                   
              }, (error: ErrorEvent) => {
              })
              
              }
          }
              
          
            
  
          
          
          addParticipant ( ) {
              this.productService.addParticipant(this.tokenStorageService.getUser().id.toString(),this.id,this.product).subscribe(data => console.log(data), error => console.log(error));
              this.product = new Program();
  
          }
          onSubmit() {
              console.log("product1",this.product)
  
              this.addParticipant();  
              console.log("product",this.product)
  
    
             
  
  
            }
            reloadPage() : void {
              window.location.reload();
            }

            onLocationSelected(location: Location) {
              this.productService.addPlace(this.product.id,location).subscribe(data2 => {
                console.log("data",data2)
                this.eventWithPlace = data2;
                this.latitude = this.eventWithPlace.place.latitude;
                this.longitude = this.eventWithPlace.place.longitude
              }, error => console.log(error));
             
              return location;
            }
          


          }
          interface marker {
            latitude: number;
            longitude: number;
            label?: string;
          }
          interface Location {
            latitude: number;
            longitude: number;
        }
        
        