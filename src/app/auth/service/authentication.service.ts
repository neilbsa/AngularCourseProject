import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 apiKey : string = '<google API here>';
 userSub : BehaviorSubject<User> = new BehaviorSubject<User>(null);
 tokenExpirationTimer : any;
private localStorageUserKey: string = 'userData';



  constructor(private httpClient : HttpClient,private router : Router) { }



logout(){
  this.userSub.next(null);
  localStorage.removeItem(this.localStorageUserKey)
  this.router.navigate(['/auth']);
  if( this.tokenExpirationTimer){
    clearTimeout( this.tokenExpirationTimer);

  }

  this.tokenExpirationTimer = null;
}
 

  autoLogOut(expirationDuration : number){
      this.tokenExpirationTimer= setTimeout(()=>{
          this.logout();
        },expirationDuration)
  }



  signUp(body) 
  {
    const bodyRequire = { ...body, returnSecureToken : true };
  
    return this.httpClient.post<AuthResponseData>
    (`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ this.apiKey }`,bodyRequire)
    .pipe(
      catchError(this.handleAuthError),
      tap(resData =>{
          this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
      })
    )
  }


  logIn(body){
  
    const bodyRequire = { ...body, returnSecureToken : true };
   
    return this.httpClient.post<AuthResponseData>
    (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ this.apiKey }`,bodyRequire)
    .pipe(
      catchError(this.handleAuthError),
      tap(resData =>{
        this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
    })
    )
  }

autoLoging()
{
    const userData : {
      email: string,
      id: string,
      _token: string,
      _tokenExpiration: string

    } =JSON.parse(localStorage.getItem(this.localStorageUserKey))
    if(!userData){
      return;
    }

   const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpiration));
    if(loadedUser.token){
      this.userSub.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpiration).getTime()- new Date().getTime();
   

      this.autoLogOut(expirationDuration)
    }

  }



handleAuthentication(email: string,userId : string, token: string, expiresIn :number ){

 const expirationDate = new Date(new Date().getTime() + expiresIn* 1000);
          const user : User = new User(email,userId,token,expirationDate);
          this.userSub.next(user);
          this.autoLogOut(expiresIn*1000)
      localStorage.setItem(this.localStorageUserKey, JSON.stringify(user))

}


  private handleAuthError(errorResponse : HttpErrorResponse){
    let errorMessage = 'An Unknown Error occured';
   
    if(!errorResponse.error || !errorResponse.error.error){
      return throwError(errorMessage);
    }
    switch(errorResponse.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = 'This Email already exist';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This Email doesnt exist';
        break;
      case 'INVALID_PASSWORD':
          errorMessage = 'This PASSWORD is not valid';
          break;
      case 'USER_DISABLED':
            errorMessage = 'Account Disabled';
            break;
    }

    return throwError(errorMessage);
  }

}


export interface AuthResponseData {
  idToken : string;
  email : string;
  refreshToken : string;
  expiresIn : string;
  localId: string;
  registered? : boolean;
}
