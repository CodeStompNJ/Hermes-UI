export class Message {
  Text: string;
  ID: number;
  ChatroomID: number;
  UserID: string;

  constructor(id: number, text: string, chatroomid: number, userid: string) {
    this.Text = text;
    this.ID = id;
    this.ChatroomID = chatroomid;
    this.UserID = userid;
  }
}
