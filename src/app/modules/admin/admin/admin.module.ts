import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ExtractEventsModule } from './extract-events/extract-events.module';
import { ManageEventsModule } from './manage-events/manage-events.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ExtractEventsModule,
    ManageEventsModule
  ]
})
export class AdminModule { }
