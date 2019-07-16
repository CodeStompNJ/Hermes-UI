export class Message {
  text: string;
  id: number;
  chatroomid: number;
  userid: string;

  constructor(id: number, text: string, chatroomid: number, userid: string) {
    this.text = text;
    this.id = id;
    this.chatroomid = chatroomid;
    this.userid = userid;
  }
}
