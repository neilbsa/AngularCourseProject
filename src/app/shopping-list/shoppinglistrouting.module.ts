import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

const shoppingRoutes : Routes = [
  { path: 'shopping-list', component: ShoppingListComponent }
]

@NgModule({
 
  imports: [
    RouterModule.forChild(shoppingRoutes)
  ],
  exports:[RouterModule]
})
export class ShoppinglistroutingModule { }
