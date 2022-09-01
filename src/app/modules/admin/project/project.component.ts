import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    Location,
    GermanAddress,
  } from '@angular-material-extensions/google-maps-autocomplete';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { Program } from 'app/models/Program';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsersService } from 'app/__services/user_services/users.service';
import { NotifDto } from 'app/models/NotifDto';
import { WebSocketNotifService } from 'app/__services/Event_services/web-socket-notif.service';
@Component({
    selector     : 'example',
    templateUrl  : './project.component.html',
    styleUrls: ['./project.component.scss'],

    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent implements OnInit
{  unreadCount : any;

   notif : any
  products: Program[];
  products2: Program[];
  searchPrograms = [];
  searchForm = this.fb.group({
    destination: '',
    date: ''
  });

  /**
   * Constructor
   */
  constructor(private productsService: ProductsService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private userService: UsersService,
    public webSocketNotifService: WebSocketNotifService,




  ) {
  }


  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products: Program[]) => {
      this.products = products;
      this.products2 = this.products.reverse().slice(0, 4);
      this.reminder()
      console.log("program", this.products2)
      console.log("length", products[products.length - 1])
    }, (error: ErrorEvent) => {
    })
  }


  search() {
    console.log('search ->', this.searchForm.value);
    this.searchPrograms = this.products;
    console.log('searchPrograms ->', this.searchPrograms);
    const searchDestination = this.searchForm.value['destination'].trim().toLowerCase();
    const searchDate = this.searchForm.value['date'];
    this.searchPrograms.map(program => program.date = this.datePipe.transform(new Date(program.cree), "yyyy-MM-dd"));
    this.searchPrograms = this.searchPrograms.filter((program) => program.title.includes(searchDestination) || program.date.includes(searchDate));
    console.log('programs + filter ->', this.searchPrograms);
    this.productsService.setSearch(this.searchPrograms);
    this.router.navigate(['/events/list']);
    //this.reminder()
  }

  reminder() {
    if (this.products.length) {
      const programs = this.products.filter(program => program.participant.length);
      programs.map(program => {
        if (this.isTomorrow(program.date) && program.remindred == false) {
          program.participant.map(el => {
            this.userService.addNotifToUser(el.id, "Hey " + el.username + " ! Just a friendly reminder from " +  program.organizer.username+ " that " + program.title +  " is happening tomorrow at 7.AM. Please make sure to arrive 30 minutes in advance. If you can't make the time slot, please let me know to reschedule. Can't wait to see you! <3 ").subscribe(data => {
              console.log("data",data)
              this.notif = data; 
         
              const notifDtoR = new NotifDto(el.id, "Hey " + el.username + "! Just a friendly reminder from " +  program.organizer.username+ " that " + program.title +  " is happening tomorrow at 7.AM. Please make sure to arrive 30 minutes in advance. If you can't make the time slot, please let me know to reschedule. Can't wait to see you! <3 ",this.notif.notifCount, this.unreadCount);
        
            this.webSocketNotifService.sendMessage(notifDtoR);
            console.log("h",notifDtoR);     })
        
          })
          this.productsService.reminderEvents(program.id).subscribe((products: Program) => {
            program = products;
        });
        }
      })
      console.log('reminder ->', programs);
    }
  }

  isTomorrow(searchedDate: any) {
    let programDate = new Date(searchedDate);
    let date = new Date();
    let date_tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2);
    if (date_tomorrow.getFullYear() == programDate.getFullYear() && date_tomorrow.getMonth() == programDate.getMonth() && date_tomorrow.getDate() == programDate.getDate()) {
      return true;
    } else {
      return false;
    }
  }

}

