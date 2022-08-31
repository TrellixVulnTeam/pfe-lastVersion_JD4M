import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { Users } from 'app/models/Users';
import { WebSocketNotifService } from 'app/__services//Event_services/web-socket-notif.service';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoggedIn = false;
    username: string;
    users : Users;
    email : string;
    role : string;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private UserService : UsersService,
        private tokenStorageService: TokenStorageService,
        private userService : UsersService,
        public webSocketNotifService: WebSocketNotifService,
        private _changeDetectorRef: ChangeDetectorRef,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.isLoggedIn = !!this.tokenStorageService.getToken();
   
        if (this.isLoggedIn) {
          const userConnected = this.tokenStorageService.getUser();
          this.username = userConnected.username;
          this.email = userConnected.email;
          const roles = this.tokenStorageService.getUser().roles;
          if (roles.includes('ROLE_USER')) {
              this.role = 'ROLE_USER';
          }
          if (roles.includes('ROLE_ADMIN')) {
              this.role = 'ROLE_ADMIN';
          } 
      
      
          //console.log('org',this.productsService.getOrganizer(this.products))
          console.log('name',this.tokenStorageService.getUser());
          this.userService.getUser(this.tokenStorageService.getUser().id.toString()).subscribe(data => {
          
          
         
            this.users = data;
            console.log("email",this.users.email)
            
              })
              this.userService.getUser(this.tokenStorageService.getUser().id
              ).subscribe((users : Users) => {
                  this.users = users;
                  console.log("user",this.users)
                  this._changeDetectorRef.markForCheck()

              }, (error: ErrorEvent) => {
              })
        }
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });
         
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

            

    
}

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
