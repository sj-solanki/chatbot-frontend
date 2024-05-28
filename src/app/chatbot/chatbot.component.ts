import { Component, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  messages: { sender: string, content: string | SafeHtml }[] = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
  newMessage = '';

  private flaskEndpoint = 'http://127.0.0.1:5000/process'; // Update this URL to match your Flask server
  private selectEndpoint = 'http://localhost:3000/select'; // The select API endpoint for your Node.js server

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private renderer: Renderer2) { }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      this.getResponse();
      this.newMessage = '';
    }
  }

  getResponse() {
    const userMessage = this.messages[this.messages.length - 1].content as string;

    this.http.post<any>(this.flaskEndpoint, { query: userMessage }).subscribe(response => {
      if (response.status === 'success') {
        const nodeResponse = response.node_response.data.kahani_cache_dev[0];
        const botMessage = this.formatResponse(nodeResponse);
        this.messages.push({ sender: 'bot', content: botMessage });
        this.addEnrollEventListeners();
      } else {
        this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong. Please try again.' });
    });
  }

  formatResponse(course: any): SafeHtml {
    const htmlContent = `
      <div>
        <p><strong>Title:</strong> ${course.title}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Domain:</strong> ${course.domain}</p>
        <p><strong>Language:</strong> ${course.language}</p>
        <p><strong>Min Age:</strong> ${course.minAge}</p>
        <button class="enroll-button" data-course-id="${course.item_id}" data-provider-id="${course.provider_id}">Enroll</button>
      </div>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  addEnrollEventListeners() {
    setTimeout(() => {
      const buttons = document.querySelectorAll('.enroll-button');
      buttons.forEach(button => {
        const courseId = button.getAttribute('data-course-id');
        const providerId = button.getAttribute('data-provider-id');
        if (courseId && providerId) {
          this.renderer.listen(button, 'click', () => this.enroll(courseId, providerId));
        }
      });
    }, 0);
  }

  enroll(courseId: string, providerId: string) {
    const payload = {
      context: {
       "domain": "onest:learning-experiences",
        "action": "select",
        "version": "1.1.0",
        "bap_id": "kahani-bap.tekdinext.com",
        "bap_uri": "https://kahani-bap.tekdinext.com/",
        "bpp_id": "sandbox.onest.network/adaptor-bpp/smartlab",
        "bpp_uri": "https://sandbox.onest.network/adaptor-bpp/smartlab/bpp",
        transaction_id: this.generateUUID(),
        message_id: this.generateUUID(),
        timestamp: new Date().toISOString()
      },
      message: {
        order: {
          provider: { id: providerId },
          items: [{ id: courseId }]
        }
      }
    };

    this.http.post<any>(this.selectEndpoint, payload).subscribe(response => {
      if (response && response.responses && response.responses.length > 0) {
        this.messages.push({ sender: 'bot', content: JSON.stringify(response, null, 2) });
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
    });
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
    } catch (err) { }
  }
}
