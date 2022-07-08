import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UsersService } from 'app/__services/user_services/users.service';

@Component({
    selector       : 'settings-team',
    templateUrl    : './team.component.html',
    styleUrls: ['./team.component.scss'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTeamComponent implements OnInit
{
    members: any[];
    roles: any[];
    eventsAdded: Program[];
    user : Users;
    isLoggedIn = false;
    username : string;
    participants : any [];
    isPending = false;
    eventPending : any ;



    /**
     * Constructor
     */
    constructor(private userService: UsersService,
        private cdr: ChangeDetectorRef,
        private tokenStorageService: TokenStorageService,
        private productService : ProductsService,


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
    {    this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
           
            this.user = this.tokenStorageService.getUser();
            //this.userService.geteventsAdded(this.user.id).subscribe((products : any[]) => {
            //this.eventsAdded = products;
            this.productService.getPendingProducts().subscribe((products : any[]) => {
                this.eventPending = products;
            for( let event of this.eventPending) {
                if(event.event.organizer.username == this.tokenStorageService.getUser().username ) {
                    this.isPending = true ;

                
            this.productService.getPendingPartcipants(event.event.id).subscribe((users : any[]) => {
             this.participants = users;
             console.log(this.participants)
            })
        }
        console.log("eventAdded",this.tokenStorageService.getUser().username)       

    }
            this.cdr.markForCheck();     
            });
        }
        // Setup the team members
           

        // Setup the roles
        this.roles = [
            {
                label      : 'Read',
                value      : 'read',
                description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
            },
            {
                label      : 'Write',
                value      : 'write',
                description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
            },
            {
                label      : 'Admin',
                value      : 'admin',
                description: 'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
            }
        ];

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    changeStatus (id : string,productId : string){
        this.productService.getPendingProducts().subscribe((products : any[]) => {
            this.eventPending = products;
        this.productService.ChangeStatus(id,productId).subscribe((products : any[]) => {
            this.eventPending.event = products;
            console.log("status",productId);
            window.location.reload();

        })})}

}
