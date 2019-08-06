import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Credentials, CredentialsService } from './credentials.service';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // @TODO
    // MODIFY HERE TO DEAL WITH SAVING LOCAL AND SESSION INFO, MONDAY
    // Replace by proper authentication call
    // This is where we send password to backend to validate using /postCreds
    // presumably we'll return a token that we can verify the user's session with
    // if it fails we don't login
    // for now just use a hardcoded tolken
    // have function return a token we got from the backend by subscribing to backend

    const data = {
      username: context.username,
      token: '123456'
    };
    this.credentialsService.setCredentials(data, context.remember);
    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    // wipe from sessionStorage
    this.credentialsService.setCredentials();
    return of(true);
  }

  // need new backend http request that will take these values and authenticate
  // if successfully authenticated return some non password or token item that the user can use to maintain access
  postCreds(username: string, password: string): Observable<any> {
    console.log('here we send login info to backend');
    return this.httpClient.post('/signin', {
      username,
      password
    });
  }
}
