import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { QuoteService } from './quote.service';
import { ChatService } from './chat.service';
import { Message } from './message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  history: any = []; // @TODO: think about renaming?
  inputVar = ''; // Landing value for message <input>

  socket$: WebSocketSubject<any>; // @todo: move to service

  constructor(private quoteService: QuoteService, private chatService: ChatService) {}

  ngOnInit() {
    this.socket$ = webSocket('ws://localhost:8000/ws'); // @todo move to environment variable
    // const json = JSON.stringify(this.chatService.getHistory());

    this.socket$.subscribe(event => {
      if (event.type === 'message') {
        this.messagePush(event.content);
      }
    });

    // console.log('heck ME' + json);

    this.isLoading = true;
    this.chatService
      .getHistory()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(messages => {
        // @TODO - make an message object
        this.history = messages; // setting the history values
      });
  }

  /**
   * Push a message to the history container on UI
   * @param sample text value entered from UI
   */

  messagePush(message: string) {
    // create a new message
    const messageObj = new Message(1, message, 1, 'User');
    this.history.push(messageObj);

    // Set input to empty after sending text
    this.inputVar = '';
  }

  /**
   * Post a message to the database on backend
   * @param message text value entered from UI
   * Will need to send other user data but may be done somewhere else
   * thinking to set user values based on login session and pull frmo there
   * can use inputVar instead of passing in message maybe?
   */

  postMessage(message: string) {
    // this.messagePush(message);
    // this.chatService.postMessage(message).subscribe(id => {
    //   console.log('created id of message: ', id);
    // });
    this.socket$.next(message);
  }
}
