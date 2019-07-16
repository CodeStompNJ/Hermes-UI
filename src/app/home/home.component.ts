import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  history: any = []; // @TODO: think about renaming?

  constructor(private quoteService: QuoteService, private chatService: ChatService) {}

  ngOnInit() {
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
  }

  postMessage() {
    this.chatService.postMessage().subscribe(id => {
      console.log('created id of message: ', id);
    });
  }
}
