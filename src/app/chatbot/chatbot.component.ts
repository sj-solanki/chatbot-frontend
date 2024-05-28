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
  private initEndpoint = 'http://localhost:3000/init'; // The init API endpoint for your Node.js server

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
        this.messages.push({ sender: 'bot', content: 'Sorry, item is not available or else try to send prompt in different way.' });
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
        <p><strong>Provider Name:</strong> ${course.provider_name}</p>
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
        this.addNextButton();
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
    });
  }

  addNextButton() {
    const nextButtonHtml = this.sanitizer.bypassSecurityTrustHtml(`<button class="next-button">Next</button>`);
    this.messages.push({ sender: 'bot', content: nextButtonHtml });
    setTimeout(() => {
      const nextButton = document.querySelector('.next-button');
      if (nextButton) {
        this.renderer.listen(nextButton, 'click', () => this.showForm());
      }
    }, 0);
  }

  showForm() {
    const formHtml = this.sanitizer.bypassSecurityTrustHtml(`
      <form id="user-details-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br>
        <label for="age">Age:</label>
        <input type="number" id="age" name="age"><br>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone"><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br>
        <button type="submit">Submit</button>
      </form>
    `);
    this.messages.push({ sender: 'bot', content: formHtml });
    setTimeout(() => {
      const form = document.getElementById('user-details-form');
      if (form) {
        this.renderer.listen(form, 'submit', (event) => this.handleSubmit(event));
      }
    }, 0);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const userDetails = {
      name: formData.get('name') as string,
      age: formData.get('age') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
    this.initUser(userDetails);
  }

  initUser(userDetails: any) {
    this.http.post<any>(this.initEndpoint, userDetails).subscribe(response => {
      if (response.status === 'success') {
        this.messages.push({ sender: 'bot', content: JSON.stringify(response.data, null, 2) });
      } else {
        this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
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
