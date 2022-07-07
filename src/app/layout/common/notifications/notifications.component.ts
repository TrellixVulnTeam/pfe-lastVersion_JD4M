import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {
    Overlay,
    OverlayRef
} from '@angular/cdk/overlay';
import {
    TemplatePortal
} from '@angular/cdk/portal';
import {
    MatButton
} from '@angular/material/button';
import {
    Subject,
    takeUntil
} from 'rxjs';
import {
    Notification
} from 'app/layout/common/notifications/notifications.types';
import {
    NotificationsService
} from 'app/layout/common/notifications/notifications.service';
import {
    UsersService
} from 'app/__services/user_services/users.service';
import {
    TokenStorageService
} from 'app/__services/user_services/ token-storage.service';
import {
    WebSocketNotifService
} from 'app/__services/Event_services/web-socket-notif.service';
import {
    Program
} from 'app/models/Program';
import {
    ProductsService
} from 'app/__services/Event_services/products.service';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import { Users } from 'app/models/Users';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    //changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    username: string;
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef < any > ;

    notifications: Notification[];
    unreadCount: number = 0;
    UserNotif: any;
    product: Program;
    id: string;
    NotifD : any;
    users : Users;

    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject < any > = new Subject < any > ();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        public webSocketNotifService: WebSocketNotifService,

        private userService: UsersService,
        private tokenStorageService: TokenStorageService,
        private productService: ProductsService,
        private route: ActivatedRoute, private router: Router,

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        console.log("number",this.webSocketNotifService.notifMessages.length)


        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();
            this.username = user.username;
            this.id = user.id;
            console.log(this.id);
            this._calculateUnreadCount();



            //console.log('org',this.productsService.getOrganizer(this.products))
            console.log('name', this.tokenStorageService.getUser());
        }
        this.userService.getUser(this.tokenStorageService.getUser().id
        ).subscribe((users : Users) => {
            this.users = users;
            console.log("userNot",this.users)
             
        }, (error: ErrorEvent) => {
        })
        // Subscribe to notification changes
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: Notification[]) => {

                // Load the notifications
                this.notifications = notifications;
                console.log("not", this.notifications)


                // Calculate the unread count

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this.userService.getNotifByUser(this.tokenStorageService.getUser().id)
            .subscribe(data => {
                console.log("notif", data)

                this.UserNotif = data;
            }, error => console.log(error));
        this.id = this.route.snapshot.params['id'];

        this.productService.getProduct(this.id)
            .subscribe(data => {
                console.log("product",data)
                this.product = data;
            }, error => console.log(error));


       

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));

    }

    /**
     * Close the notifications panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this.userService.MarkAllAsRead(this.tokenStorageService.getUser().id).subscribe((notif) => {
     this.unreadCount = notif.notifCount  ;
     this._changeDetectorRef.markForCheck();
     console.log("notif", notif) })
}

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notification): void {
        // Toggle the read status
        notification.read = !notification.read;

        // Update the notification
        this._notificationsService.update(notification.id, notification)
    }

    /**
     * Delete the given notification
     */
    delete(notification: Notification): void {
        // Delete the notification
        this._notificationsService.delete(notification.id).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([{
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {

        this.userService.getNotifD(this.tokenStorageService.getUser().id)
            .subscribe(data => {

                this.NotifD = data;
                console.log("notifD", this.NotifD)

                this.unreadCount = this.NotifD.notifCount;
                console.log("ok", this.unreadCount)



            }, error => console.log(error));


    }
}