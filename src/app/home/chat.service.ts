import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private httpClient: HttpClient) {}

  getHistory(): Observable<any> {
    return this.httpClient
      .cache()
      .get('/history')
      .pipe(
        map((body: any) => body), // @TODO: convert to message obect here
        catchError(() => of('Error, could not load joke :-('))
      );
  }
}
