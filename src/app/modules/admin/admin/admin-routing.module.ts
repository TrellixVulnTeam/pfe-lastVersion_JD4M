import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'extract-events',
    loadChildren: () => import('app/modules/admin/admin/extract-events/extract-events.module').then(m => m.ExtractEventsModule)
  },
  {
    path: 'manage-events',
    loadChildren: () => import('app/modules/admin/admin/manage-events/manage-events.module').then(m => m.ManageEventsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
