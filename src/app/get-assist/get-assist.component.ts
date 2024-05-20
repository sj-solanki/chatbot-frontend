import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-assist',
  templateUrl: './get-assist.component.html',
  styleUrl: './get-assist.component.css'
})
export class GetAssistComponent {
  // userInput: string = '';
  // searchResult: any;
  // constructor(private http: HttpClient) {}
  // search() {
  //   const requestData = {
  //     title: this.userInput
     
  //   };

  //   this.http.post<any>('http://localhost:3000/search', requestData).subscribe(
  //     (response) => {
  //       this.searchResult = response;
  //       console.log(this.searchResult);
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       // Handle error
  //     }
  //   );
  // }
  messages = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
  newMessage = '';
  private recognition: any;

  constructor() {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.onresult = (event: any) => {
      this.newMessage = event.results[0][0].transcript;
    };
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      this.getResponse();
      this.newMessage = '';
    }
  }

  getResponse() {
    this.messages.push({ sender: 'bot', content: 'This is a response from the chatbot.' });
  }

  startVoiceInput() {
    this.recognition.start();
  }

  clearChat() {
    this.messages = [
      { sender: 'bot', content: 'Hello! How can I help you?' }
    ];
  }

  scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}
