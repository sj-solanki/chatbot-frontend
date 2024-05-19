import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  messages = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
  newMessage = '';

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

  private recognition: any;

  constructor() {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.onresult = (event: any) => {
      this.newMessage = event.results[0][0].transcript;
      this.sendMessage();
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
} 
