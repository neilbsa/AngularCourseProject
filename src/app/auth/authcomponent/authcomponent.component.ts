import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../model/user';
import { AuthenticationService, AuthResponseData } from '../service/authentication.service';

@Component({
  selector: 'app-authcomponent',
  templateUrl: './authcomponent.component.html',
  styleUrls: ['./authcomponent.component.css']
})




export class AuthcomponentComponent implements OnInit {

  
  loginForm : FormGroup;
  
  isLoginMode : boolean = true;
  isLoading : boolean = false;
  authInstruction : Observable<AuthResponseData>

  error : string = null;
  constructor(private authService : AuthenticationService, private router : Router) { }

  ngOnInit(): void {
      this.initForm();
  }


  initForm(){
    this.loginForm = new FormGroup({
      email : new FormControl(null, [Validators.required,Validators.email]),
      password : new FormControl(null,[Validators.required,Validators.minLength(10)])
    })
  }

  onLoginSubmit(){
    if(!this.loginForm.valid){
      return;
    }
    this.error = null;
    if(!this.isLoginMode){
        //sign up mode
      this.isLoading=true;
       this.authInstruction=  this.authService.signUp(this.loginForm.value);
    }else{
        this.isLoading=true;
        this.authInstruction=  this.authService.logIn(this.loginForm.value);
    }



    this.authInstruction.subscribe(
      args=>{
        this.isLoading=false;
  
        this.router.navigate(['/recipes']);
      },error =>{
        this.isLoading=false;
        this.error = `Error occured: ${ error }`;
       
      }
    );


    this.loginForm.reset();
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError(){
    this.error = null;
  }

}
