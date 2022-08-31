import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { AuthService } from 'app/__services/user_services/auth.service';

@Component({
  selector: 'app-authen',
  templateUrl: './authen.component.html',
  styleUrls: ['./authen.component.scss']
})
export class AuthenComponent implements OnInit
{    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage = '';
    roles: string[] = [];
    form2 = new FormGroup({
      username : new FormControl('', Validators.minLength(2)),
      password: new FormControl(''),
    });
    /**
     * Constructor
     */
    constructor(
      private _activatedRoute: ActivatedRoute,

        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private tokenStorage: TokenStorageService,
        private authService: AuthService,
        private _router: Router,
        private cdr: ChangeDetectorRef,




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
    {    console.log(this.form2)

        // Create the form
        this.signInForm = this._formBuilder.group({
            username  : ['',Validators.required],
            password  : ['',Validators.required],
            rememberMe: ['']



        });
        console.log(this.signInForm);


        if (this.tokenStorage.getToken()) {
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
        }

      }
      onSubmit(): void {
        this.authService.login(this.form).subscribe(
          data => {
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(data);
    
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;

          },
          err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }
          
        );
      

    
    }
   
    reloadPage() : void {
        window.location.reload();
      }

      signIn(): void
      {
          // Return if the form is invalid
          if ( this.signInForm.invalid )
          {
              return;
          }
  
          // Disable the form
          this.signInForm.disable();
  
          // Hide the alert
          this.showAlert = false;
  
          // Sign in
          this.authService.login(this.signInForm.value)
              .subscribe(
                  (data) => {
  
                      // Set the redirect url.
                      // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                      // to the correct page after a successful sign in. This way, that url can be set via
                      // routing file and we don't have to touch here.
                      this.tokenStorage.saveToken(data.accessToken);
                      this.tokenStorage.saveUser(data);  
                      this.isLoginFailed = false;
                      this.isLoggedIn = true;
                      this.roles = this.tokenStorage.getUser().roles;
                      // Navigate to the redirect url
                     
                      // Navigate to the redirect url
                      this.reloadPage()

                  },
                  (response) => {
  
                      // Re-enable the form
                      this.signInForm.enable();
  
                      // Reset the form
                      this.signInNgForm.resetForm();
  
                      // Set the alert
                      this.alert = {
                          type   : 'error',
                          message: 'Wrong email or password'
                      };
  
                      // Show the alert
                      this.showAlert = true;
                  }
              );
      }

    
}