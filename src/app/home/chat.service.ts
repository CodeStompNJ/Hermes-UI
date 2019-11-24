import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private httpClient: HttpClient) {}

  getHistory(groupID = 1): Observable<any> {
    // returns object Object
    return this.httpClient
      .cache()
      .get(`/history/${groupID}`)
      .pipe(
        map((body: any) => body), // @TODO: convert to message obect here
        catchError(() => of('Error, could not load history :-('))
      );
  }

  /**
   * Post a new message
   * @param message text of message
   * @param username name of user
   * Right now the data being sent to server is hardcoded
   */

  postMessage(message: string, username: string = 'test'): Observable<any> {
    return this.httpClient.post('/message', {
      email: 'test@test.com',
      username,
      group: 'general',
      message
    });
  }
}
