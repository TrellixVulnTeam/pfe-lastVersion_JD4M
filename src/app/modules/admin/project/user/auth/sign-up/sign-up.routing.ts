import { Route } from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/admin/project/user/auth/sign-up/sign-up.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignUpComponent
    }
];
