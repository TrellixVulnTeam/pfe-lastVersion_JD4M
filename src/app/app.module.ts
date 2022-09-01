import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ExampleComponent } from './modules/admin/project/project.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './modules/admin/admin/admin.module';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        ExampleComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        FormsModule,
        CommonModule,
        ReactiveFormsModule,

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
         AppRoutingModule,
         MatIconModule,
         ServiceWorkerModule.register('ngsw-worker.js', {
           enabled: environment.production,
           // Register the ServiceWorker as soon as the app is stable
           // or after 30 seconds (whichever comes first).
           registrationStrategy: 'registerWhenStable:30000'
         }),
    ],
    providers: [
        DatePipe,
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
