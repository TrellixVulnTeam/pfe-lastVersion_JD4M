import { Route } from '@angular/router';
import { AuthUnlockSessionComponent } from 'app/modules/admin/project/user/auth/unlock-session/unlock-session.component';

export const authUnlockSessionRoutes: Route[] = [
    {
        path     : '',
        component: AuthUnlockSessionComponent
    }
];
