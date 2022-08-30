import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventsComponent } from './manage-events.component';

const routes: Routes = [{
  path: '', component: ManageEventsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventsRoutingModule { }
