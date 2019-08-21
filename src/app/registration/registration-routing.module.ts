import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { RegistrationComponent } from './registration.component';

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { title: extract('Registration') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RegistrationRoutingModule {}
