import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/service/authentication.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private dataStorageService: DataStorageService, private authService : AuthenticationService) {}
  userSubscriber : Subscription = new  Subscription();
  isAuthenticated = false;

  
  ngOnInit(){
    this.userSubscriber=this.authService.userSub.subscribe( user =>{
      this.isAuthenticated = !!user;
     
      
    });
  }



  onSaveData() {  
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogOut(){
    this.authService.logout()
    
  }

  ngOnDestroy(){
    this.userSubscriber.unsubscribe();
  }
}
