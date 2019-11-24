import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../home/chat.service';
import { finalize } from 'rxjs/operators';
import { Message } from '../home/message';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input() ID: number;
  History: any = [];
  isLoading = false;

  constructor(private chatService: ChatService) {
    this.ngOnInit();
  }

  ngOnInit() {
    console.log('start');
    console.log(
      this.chatService.getHistory().subscribe(messages => {
        this.History = messages; // setting the history values
      })
    );
    console.log('end');

    this.chatService
      .getHistory()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(messages => {
        this.History = messages; // setting the history values
      });
  }
}
