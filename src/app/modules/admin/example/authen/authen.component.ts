import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { TokenStorageService } from 'app/__services/ token-storage.service';
import { AuthService } from 'app/__services/auth.service';

@Component({
  selector: 'app-authen',
  templateUrl: './authen.component.html',
  styleUrls: ['./authen.component.scss']
})
export class AuthenComponent implements OnInit
{
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
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private tokenStorage: TokenStorageService,
        private authService: AuthService,


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
            username  : '',
            password  : '',


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
            this.reloadPage();
          },
          err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }
        );
      

    
    
    }
    onSubmit2(): void {
      this.authService.register(this.form).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
    }
    reloadPage() : void {
        window.location.reload();
      }



    
}