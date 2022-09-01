import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

 
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UsersService,
        private _router: Router,


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
        this.resetPasswordForm = this._formBuilder.group({
               email       : ['', Validators.required],

                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {  if ( this.resetPasswordForm.invalid )
        {
            return;
        }
  
        // Disable the form
        this.resetPasswordForm.disable();
  
        // Hide the alert
        this.showAlert = false;
  
        this.userService.resetPassword(this.resetPasswordForm.get('email').value,this.resetPasswordForm.get('passwordConfirm').value)
            .pipe(
                finalize(() => {
  
                    // Re-enable the form
                    this.resetPasswordForm.enable();
                    this.resetPasswordForm.reset();
  
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
