import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Users } from 'app/models/Users';
import { UsersService } from 'app/__services/user_services/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
      type   : 'success',
      message: ''
  };
  forgotPasswordForm: FormGroup;
  showAlert: boolean = false;
  user  : Users[]

  /**
   * Constructor
   */
  constructor(
      private _authService: AuthService,
      private _formBuilder: FormBuilder,
      private userService: UsersService,
  
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
      this.forgotPasswordForm = this._formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
      });
      this.userService.getUsers().subscribe((res) => {
                  this.user = res;
                  console.log(this.user)
    })}
  

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Send the reset link
   */
  sendResetLink(): void
  {
      // Return if the form is invalid
      if ( this.forgotPasswordForm.invalid )
      {
          return;
      }

      // Disable the form
      this.forgotPasswordForm.disable();

      // Hide the alert
      this.showAlert = false;

      // Forgot password
      this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
          .pipe(
              finalize(() => {

                  // Re-enable the form
                  this.forgotPasswordForm.enable();

                  // Reset the form
                  this.forgotPasswordNgForm.resetForm();

                  // Show the alert
                  this.showAlert = true;
              })
          )
          .subscribe(
              (response) => {
            
                  
                  // Set the alert
                  this.alert = {
                      type   : 'success',
                      message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
                  };
                  this.userService.SendMail(this.forgotPasswordForm.get('email').value).subscribe((res) => {
                  
              })},
              (response) => {

                  // Set the alert
                  this.alert = {
                      type   : 'error',
                      message: 'Email does not found! Are you sure you are already a member?'
                  };
              }
          );
          
  }
  
}

