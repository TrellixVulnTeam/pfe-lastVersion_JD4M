import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { Subject } from 'rxjs';

@Component({
    selector     : 'forms-wizards',
    templateUrl  : './wizards.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FormsWizardsComponent implements OnInit ,AfterViewInit, OnDestroy
{
    pageType: string;
    productForm: FormGroup;
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    isLoggedIn = false;
    stripe;
    card: any;
    @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
    latitudedef: number = 35.825603;
    latitude: any;
    longitude: any;
    longitudedef: number = 10.608395;
    event: Program = new Program();    
    submitted = false;
    public user : Users
    private _unsubscribeAll: Subject<any>;
    public isProductInCart : boolean;
    selectedFile2: any;
    imgURL2: any;
    selectedFile: File;
    receivedImageData: any;
    base64Data: any;
    convertedImage: string;
    products : Program[];
    programsadded : any[];
    eventTest:any;
    idTest:any = [];
    Null:null;
    images : File[]
    myForm: any;
    result: string = '';
    selectedFiles: File[];
    picture4: any[];
    free2: any;
    eventLocation : any;
    eventWithPlace : any;
    eventWithCard : any;
    data : any;
    error : string;
    confirmation;
    minDate = new Date();
    maxDate = new Date(2024,0,1);
    cardHandler = this.onChange.bind(this);
    horizontalStepperForm: FormGroup;
    verticalStepperForm: FormGroup;
    markers: marker[] = [
      {
        latitude: this.latitudedef,
  
        longitude: this.longitudedef,
        label: 'your place',
      },
    ];

    /**
     * Constructor
     */
    constructor(private _formBuilder: FormBuilder,
        private productsService : ProductsService,
        private router: Router,
        private tokenStorageService: TokenStorageService,
        private http: HttpClient,
        private userService: UsersService,
        private productService : ProductsService,
        private cd: ChangeDetectorRef,
        private stripeService:AngularStripeService
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                title   : [''],
                description : [''],
                type: [''],
                price: [''],
                date:['']

            }),
            step2: this._formBuilder.group({
              location:['']
            }),
            step3: this._formBuilder.group({
            }),
            
            step4: this._formBuilder.group({

                
            })
        });

        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email   : ['', [Validators.required, Validators.email]],
                country : ['', Validators.required],
                language: ['', Validators.required]
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                about    : ['']
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true]
                }),
                pushNotifications: ['everything', Validators.required]
            })
        });
    }

  

    onSubmit() {
        this.submitted = true;
        this.save();   
        console.log("ok",this.eventTest);
 
      }
      save() {
        this.productsService
        .addToCart(this.tokenStorageService.getUser().id.toString(),this.event).subscribe(data => {
          
          
         
          this.eventTest = data;
          
        },

         
        error => console.log(error));
      }
    
     

      ////////////:
      /////////////
      /////////////


      public  onFileChanged2(event) {
        console.log(event);
        this.selectedFile = event.target.files[0];
      
        // Below part is used to display the selected image
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event2) => {
          this.imgURL2 = reader.result;
      };
      
      }



      public  onFileChanged(event) {
        console.log(event);
        this.picture4=[];
        this.free2 = event.target.files.length;
        console.log(this.free2)
        console.log(event.target.files)
        this.selectedFiles=[];
        for (var i=0; i<this.free2;i++) {
          this.selectedFiles[i] = event.target.files[i];
          console.log(this.selectedFiles[i])
        }
        for (var i=0; i<this.free2;i++) {

        
        let reader_i = new FileReader();
        reader_i.readAsDataURL(event.target.files[i]);

        reader_i.onload = (event2) => {
          this.picture4.push(reader_i.result);


      }
      console.log("img2",this.picture4)

      ;}
    }
      
    clickMethod() {
        if(confirm("do you want to cancel the process of adding " + ' ' + this.eventTest.title + ' ' )) {
          this.productsService.deleteEvent(this.eventTest.id)
              .subscribe(
                data => {
                  console.log(data);
                
        
        
                },
                error => console.log(error));
                this.reloadPage();

                this.router.navigate(['/events/list'])
 
         
        }
        else {
            
 //this.router.navigate(['/events/add'])
            //this.reloadPage;
        

        }
      }


      deleteEvent(id : string) {
        this.productsService.deleteEvent(id)
          .subscribe(
            data => {
              console.log(data);
             
    
            },
            error => console.log(error));
    
      }

      addImage ( ) {
        console.log(this.eventWithPlace);
        const uploadData = new FormData();
        console.log(this.selectedFiles)
        for(var i=0;i<this.selectedFiles.length;i++) {
        uploadData.append('myFile', this.selectedFiles[i],this.selectedFiles[i].name);}
        this.productService.addImage(this.eventWithPlace.id,uploadData ).subscribe(
          res => {console.log("res",res);
            this.receivedImageData = res;
            this.base64Data = this.receivedImageData.pic;
            this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.eventLocation = res;
          this.reloadPage();

          },
            
    err => console.log('Error Occured duringng saving: ' + err)
 );
          //this.router.navigate(['/events/list'])
          //this.reloadPage();


    
          
          ;
          this.event = new Program;
         

       
       /*   this.router.navigate(['/apps/academy/courses'])
          .then(() => {
           window.location.reload();
})*/;

    }
    onSubmit2() {
      //this.submitted = false;
      this.submitted = true;

        this.addImage(); 
        console.log("this.data",this.data)

        this.router.navigate(['/events/list'])



        
    

        


      }
      save2(event: any): void {
        this.selectedFiles = event.target.files;
        for (var i = 0; i < this.selectedFiles.length; i++) {
          this.result += '<br>File Name: ' + this.selectedFiles[i].name;
          this.result += '<br>File Size(byte): ' + this.selectedFiles[i].size;
          this.result += '<br>File Type: ' + this.selectedFiles[i].type;
          this.result += '<br>----------------------------';
          
        }
      }
      reloadPage() : void {
        window.location.reload();
      }
      onLocationSelected(location: Location) {
        this.productService.addPlace(this.eventWithCard.id,location).subscribe(data2 => {
          console.log("data",data2)
          this.eventWithPlace = data2;
          this.latitude = this.eventWithPlace.place.latitude;
          this.longitude = this.eventWithPlace.place.longitude
        }, error => console.log(error));
       
        return location;
      }

      onDateSelected(date : Date) {
       
          this.event.date = date;
         console.log(date)
       
        return date;
      }
      onSubmit3(){
        this.onLocationSelected;
        this.submitted = true;


      }

      async onSubmit4() {
        const { token, error } = await this.stripe.createToken(this.card);

        this.submitted = true;
        this.productService.addICardToEvent(token.card.last4,this.eventTest.id).subscribe(data2 => {
          console.log("data",data2)
          this.eventWithCard = data2;
        },);
      }
        onChange({ error }) {
          if (error) {
            this.error = error.message;
          } else {
            this.error = null;
          }
          this.cd.detectChanges();
        }
        ngAfterViewInit() {
          this.stripeService.setPublishableKey('pk_test_2syov9fTMRwOxYG97AAXbOgt008X6NL46o').then(
            stripe=> {
              this.stripe = stripe;
          const elements = stripe.elements();    
          this.card = elements.create('card');
          this.card.mount(this.cardInfo.nativeElement);
          this.card.addEventListener('change', this.cardHandler);
          });
        }
      
        ngOnDestroy() {
          this.card.removeEventListener('change', this.cardHandler);
          this.card.destroy();
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
