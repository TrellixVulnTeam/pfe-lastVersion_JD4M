import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NotifDto } from 'app/models/NotifDto';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { WebSocketNotifService } from 'app/__services/Event_services/web-socket-notif.service';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { UsersService } from 'app/__services/user_services/users.service';

@Component({
    selector       : 'settings-team',
    templateUrl    : './team.component.html',
    styleUrls: ['./team.component.scss'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTeamComponent implements OnInit,OnDestroy
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
    notif : any
    unreadCount : any;
    error: string;
    cardHandler = this.onChange.bind(this);



    /**
     * Constructor
     */
    constructor(private userService: UsersService,
        private cdr: ChangeDetectorRef,
        private tokenStorageService: TokenStorageService,
        private productService : ProductsService,
        public webSocketNotifService: WebSocketNotifService,
        private cd: ChangeDetectorRef,



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
        this.webSocketNotifService.openWebSocket();

        this.isLoggedIn = !!this.tokenStorageService.getToken();

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

    onChange({
        error
      }) {
        if (error) {
          this.error = error.message;
        } else {
          this.error = null;
        }
        this.cd.detectChanges();
      }
    ngOnDestroy() {
  
        this.webSocketNotifService.closeWebSocket();
    
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    changeStatus (id : string,productId : string){
        this.userService.addNotifToUser(id, "you have been accepted by the event organizer to be one of the participants of  " + "make sure to have fun.").subscribe(data => {
            console.log("data",data)
            this.notif = data; 
            const notifDtoR = new NotifDto(id,  "you have been accepted by the event organizer to be one of the participants  " + "make sure to have fun.",this.notif.notifCount, this.unreadCount);
            this.webSocketNotifService.sendMessage(notifDtoR);
            console.log("h",notifDtoR);     })
            this.productService.getPendingProducts().subscribe((products : any[]) => {
            this.eventPending = products;
            this.productService.ChangeStatus(id,productId).subscribe((products : any[]) => {
            this.eventPending.event = products;
            console.log("status",productId);
          

        })})

    }

}
