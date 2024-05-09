import { Component } from '@angular/core';
//import * as annyang from 'annyang';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  messages = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
  newMessage = '';
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      this.getResponse();
      this.newMessage = '';
      //code to send the user's message to a server or API
    }
}
getResponse() {
  //AI response logic here
  this.messages.push({ sender: 'bot', content: 'This is a response from the chatbot.' });
}
//new
private recognition: any;

constructor() {
  this.recognition = new (window as any).webkitSpeechRecognition();
  this.recognition.continuous = false;
  this.recognition.lang = 'en-US';
  this.recognition.onresult = (event: any) => {
    this.newMessage = event.results[0][0].transcript;
  };
}

startVoiceInput() {
  this.recognition.start();
}



clearChat() {
  this.messages = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
}
}
