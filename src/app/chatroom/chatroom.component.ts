import { Component, OnInit } from '@angular/core';
import { ChatService } from '../home/chat.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  ID: number;
  History: any = [];
  isLoading = false;

  constructor(id: number, private chatService: ChatService) {
    this.ID = id;
  }

  ngOnInit() {
    this.chatService
      .getHistory()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(messages => {
        // @TODO - make an message object
        this.History = messages; // setting the history values
      });
    console.log('big brain ', this.History);
  }
}
