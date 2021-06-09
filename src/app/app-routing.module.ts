import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthcomponentComponent } from './auth/authcomponent/authcomponent.component';


const appRoutes: Routes = [

  

  { path: 'auth', component: AuthcomponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
