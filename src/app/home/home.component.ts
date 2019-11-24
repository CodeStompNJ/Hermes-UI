import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { ChatService } from './chat.service';
import { Message } from './message';
import { ChatroomComponent } from '../chatroom/chatroom.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  history: any = []; // @TODO: think about renaming? Make a class
  inputVar = ''; // Landing value for message <input>

  chatroomObjectSource: ChatroomComponent;

  socket$: WebSocketSubject<any>; // @todo: move to service

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.socket$ = webSocket('ws://localhost:8000/ws'); // @todo move to environment variable
    // const json = JSON.stringify(this.chatService.getHistory());

    this.socket$.subscribe(event => {
      if (event.type === 'message') {
        this.messagePush(event.content);
      }
    });

    //this.chatroomObject = new ChatroomComponent(1, this.chatService);
    // console.log('heck ME' + json);
    this.isLoading = true;
    /*this.chatService
      .getHistory()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(messages => {
        // @TODO - make an message object
        this.history = messages; // setting the history values
      });*/
  }

  /**
   * Push a message to the history container on UI
   * @param sample text value entered from UI
   */

  messagePush(message: string) {
    // create a new message
    // Message(1, message, getChatroom, getUser);
    // make getChatroom and getCurrentUser fucntions
    const messageObj = new Message(1, message, this.getCurrentRoom(), this.getUserID());
    // this.history.push(messageObj);
    this.chatroomObjectSource.History.push(messageObj);
    console.log(this.chatroomObjectSource.History);
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

  getUserID(): string {
    // here we pull user data from cookie

    return 'User';
  }

  getCurrentRoom(): number {
    // based on the history we recive is the chatroom we're pulling from
    // we can implement in history to have id associated with it which is the chatroomid

    return 1;
  }
}
