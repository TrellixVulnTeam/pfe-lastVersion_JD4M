import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Route, RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SettingComponent } from 'app/layout/common/setting/settings.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { ExampleComponent } from 'app/modules/admin/project/project.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CancelComponent } from './cancel/cancel.component';
import { SuccessComponent } from './success/success.component';
import { PaymentComponent } from './payment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MatToolbarModule } from "@angular/material/toolbar";



const paymentRoutes: Route[] = [
  
    
      { path: 'cancel', component: CancelComponent },
      { path: 'success', component: SuccessComponent },
   
   
];

@NgModule({
    declarations: [
        
        SuccessComponent,
        CheckoutComponent,

    ],
    imports     : [
        RouterModule.forChild(paymentRoutes),
        MatIconModule,
        MatToolbarModule,
        
      
        
          MatButtonModule,
          MatCheckboxModule,
          MatFormFieldModule,
          MatSnackBarModule,
          MatTooltipModule,
          MatRadioModule,


          MatIconModule,
          MatInputModule,
          MatProgressSpinnerModule,
          FuseAlertModule,
          FormsModule,
          MatCardModule,

          SharedModule,


          MatStepperModule,

          MatButtonModule,
          MatCheckboxModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatRadioModule,
          MatSelectModule,
          
          



          

    ]
})
export class ExampleModule
{
}