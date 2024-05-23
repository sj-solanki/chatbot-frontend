import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // Commented out the Speech Recognition setup
  // private recognition: any;
  private flaskEndpoint = 'http://127.0.0.1:5000/process'; // Update this URL to match your Flask server

  constructor(private http: HttpClient) {
    // Commented out the Speech Recognition setup
    // if (typeof window !== 'undefined') {
    //   this.recognition = new (window as any).webkitSpeechRecognition();
    //   this.recognition.continuous = false;
    //   this.recognition.lang = 'en-US';
    //   this.recognition.onresult = (event: any) => {
    //     this.newMessage = event.results[0][0].transcript;
    //     this.sendMessage();
    //   };
    // }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      this.getResponse();
      this.newMessage = '';
    }
  }

  getResponse() {
    const userMessage = this.messages[this.messages.length - 1].content;
    
    // Send the user's message to the Flask backend
    this.http.post<any>(this.flaskEndpoint, { query: userMessage }).subscribe(response => {
      if (response.status === 'success') {
        // Assuming node_response contains the final result from Node.js server
        const botMessage = `Node Server Response: ${JSON.stringify(response.node_response)}`;
        this.messages.push({ sender: 'bot', content: botMessage });
      } else {
        this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong. Please try again.' });
    });
  }


  // Commented out the startVoiceInput method
  // startVoiceInput() {
  //   if (typeof window !== 'undefined' && this.recognition) {
  //     this.recognition.start();
  //   }
  // }

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
    } catch (err) { }
  }
}
