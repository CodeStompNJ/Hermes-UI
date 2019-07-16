import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messageData: any = [
    {
      text: 'test message',
      id: 1,
      chatroomid: 1,
      userid: 'jbond'
    },
    {
      text: '2 teste',
      id: 2,
      chatroomid: 1,
      userid: 'Dennis'
    }
  ];

  constructor(private httpClient: HttpClient) {}

  getHistory(): Observable<any> {
    return this.httpClient
      .cache()
      .get('/api/history')
      .pipe(
        map((body: any) => body), // @TODO: convert to message obect here
        catchError(() => of('Error, could not load joke :-('))
      );
  }
  getMessageData(): Observable<any> {
    return of(this.messageData);
  }
}
