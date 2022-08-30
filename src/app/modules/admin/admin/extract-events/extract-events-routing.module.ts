import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtractEventsComponent } from './extract-events.component';

const routes: Routes = [{
  path: '', component: ExtractEventsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractEventsRoutingModule { }
