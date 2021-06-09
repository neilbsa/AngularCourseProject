import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './auth/service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

/**
 *
 */
constructor(private authService : AuthenticationService) {
 

}
  ngOnInit(){
      this.authService.autoLoging();
  }
}
