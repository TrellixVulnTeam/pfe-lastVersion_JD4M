import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { Users } from 'app/models/Users';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { finalize } from 'rxjs';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    isLoggedIn = false;
    user : Users

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UsersService,
        private tokenStorageService : TokenStorageService,


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
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword  : [''],
            newPassword      : [''],
            twoStep          : [true],
            askPasswordChange: [false]
        });
        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();
            this.userService.getUser(this.tokenStorageService.getUser().id).subscribe((user: Users) => {
              this.user = user;
              console.log(this.user)
            })
    }
}
    resetPassword(): void
    {  if ( this.securityForm.invalid )
        {
            return;
        }
  
        // Disable the form
        this.securityForm.disable();
  
        // Hide the alert
        this.showAlert = false;
  
        this.userService.resetPassword(this.tokenStorageService.getUser().email,this.securityForm.get('newPassword').value)
            .pipe(
                finalize(() => {
  
                    // Re-enable the form
                    this.securityForm.enable();
                    this.securityForm.reset();
  
                    // Reset the form
                    
  
                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
              
                    
                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Password has been successfully changed.'
                    };
                    
                }),
                (response) => {
  
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Email does not found! Are you sure you are already a member?'
                    };
                }
            ;
        }
}
