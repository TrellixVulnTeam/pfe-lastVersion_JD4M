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
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { SharedModule } from 'app/shared/shared.module';
import { ProductsService } from 'app/__services/products.service';
import { SettingsComponent } from '../settings/settings.component';
import { AuthenComponent } from './authen/authen.component';
import { DetailsComponent } from './events/details/details.component';
import { ListComponent } from './events/list/list.component';
import { AddNewEventComponent } from './events/add-new-event/add-new-event.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsWizardsComponent } from './events/forms/wizards/wizards.component';


const exampleRoutes: Route[] = [
  
    {
        path     : '',
        component: ExampleComponent
    },
    {
        path     : 'list',
        component: ListComponent,
       
    },
    {
        path     : 'auth',
        component: AuthenComponent,
       
    },
    {
        path     : 'add',
        component: FormsWizardsComponent,
       
    },
   
    {
        path     : ':id',
        component: DetailsComponent,
       
    },
   
];

@NgModule({
    declarations: [
        ExampleComponent,
        ListComponent,
        AuthenComponent,
        DetailsComponent,
        AddNewEventComponent,
        FormsWizardsComponent,

    ],
    imports     : [
        RouterModule.forChild(exampleRoutes),
        MatIconModule,

        MatGoogleMapsAutocompleteModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC9i95PZGTZ4fA448DqQO61tQj8iomAc0I', // TODO: Colocar nos env variables
            libraries: ['places']
          }),
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
