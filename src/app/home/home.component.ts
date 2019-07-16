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
  holder: any = []; // @TODO: think about renaming?
  inputVar = '';

  constructor(private quoteService: QuoteService, private chatService: ChatService) {}

  ngOnInit() {
    // const json = JSON.stringify(this.chatService.messageData);

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
        this.history = messages;
      });

    this.chatService.getMessageData().subscribe(whatever => {
      // @TODO - make an message object
      this.holder = whatever;
    });
  }

  helloThere() {
    console.log(this.inputVar);
    const message = new Message(1, this.inputVar, 1, 'newMessage');
    this.holder.push(message);

    this.inputVar = '';
  }

  postMessage() {
    this.chatService.postMessage().subscribe(id => {
      console.log('created id of message: ', id);
    });
  }
}
