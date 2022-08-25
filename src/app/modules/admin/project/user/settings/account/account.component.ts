import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UsersService } from 'app/__services/user_services/users.service';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;
    isLoggedIn = false;
    username : string;
    imgURL2: string | ArrayBuffer;
    selectedFile: File;
    user : any;
    receivedImageData: any;
    base64Data: any;
    convertedImage: string;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private tokenStorageService: TokenStorageService,
        private userService : UsersService ,


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
        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
          const user = this.tokenStorageService.getUser();
          this.username = user.username;
          this.user = this.tokenStorageService.getUser();

    
    
          //console.log('org',this.productsService.getOrganizer(this.products))
          console.log('name', this.tokenStorageService.getUser());
    
        }
        // Create the form
        this.accountForm = this._formBuilder.group({
            name    : [this.username],
            username: [this.username],
            title   : ['Senior Frontend Developer'],
            image : [''],
            about   : ['Hey! This is XXX; I\'m mostly passionate about nature and choclate 🍫'],
            email   : [this.tokenStorageService.getUser().email, Validators.email],
            phone   : ['XXXXXXXX'],
            language: ['english']
        });

      
}

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
onSubmit() {
    this.save();    
  }
  save() {
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile,this.selectedFile.name);
    this.userService.addImage(this.user.id,uploadData ).subscribe(
      res => {console.log(res);
        this.receivedImageData = res;
        this.base64Data = this.receivedImageData.pic;
        this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data; },
        
err => console.log('Error Occured duringng saving: ' + err)
);

}
}