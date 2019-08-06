import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  constructor(private quoteService: QuoteService, private chatService: ChatService) {}

  ngOnInit() {
    // const json = JSON.stringify(this.chatService.getHistory());

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

  messagePush(sample: string) {
    // create a new message
    const message = new Message(1, this.inputVar, 1, 'User');
    this.history.push(message);

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
    this.messagePush(message);
    this.chatService.postMessage(message).subscribe(id => {
      console.log('created id of message: ', id);
    });
  }
}
