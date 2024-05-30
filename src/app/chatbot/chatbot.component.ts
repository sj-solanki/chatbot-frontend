import { Component, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FlaskService } from '../services/flask.service';
import { SelectService } from '../services/select.service';
import { InitService } from '../services/init.service';
import { ConfirmService } from '../services/confirm.service';

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

  constructor(
    private flaskService: FlaskService,
    private selectService: SelectService,
    private initService: InitService,
    private confirmService: ConfirmService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      this.getResponse();
      this.newMessage = '';
    }
  }

  getResponse() {
    const userMessage = this.messages[this.messages.length - 1].content as string;

    this.flaskService.postQuery(userMessage).subscribe(response => {
      if (response.status === 'success') {
        const nodeResponse = response.node_response.data.kahani_cache_dev[0];
        const botMessage = this.formatResponse(nodeResponse);
        this.messages.push({ sender: 'bot', content: botMessage });
        this.addEnrollEventListeners();
      } else {
        this.messages.push({ sender: 'bot', content: 'Sorry, item is not available or else try to send prompt in a different way.' });
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
          this.renderer.listen(button, 'click', () => this.selectCourse(courseId, providerId));
        }
      });
    }, 0);
  }

  selectCourse(courseId: string, providerId: string) {
    this.selectService.selectCourse(courseId, providerId).subscribe(response => {
      if (response && response.responses && response.responses.length > 0) {
        this.messages.push({ sender: 'bot', content: JSON.stringify(response, null, 2) });
        this.addNextButton(courseId, providerId);
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
    });
  }

  addNextButton(courseId: string, providerId: string) {
    const nextButtonHtml = this.sanitizer.bypassSecurityTrustHtml(`<button class="next-button">Next</button>`);
    this.messages.push({ sender: 'bot', content: nextButtonHtml });
    setTimeout(() => {
      const nextButton = document.querySelector('.next-button');
      if (nextButton) {
        this.renderer.listen(nextButton, 'click', () => this.showForm(courseId, providerId));
      }
    }, 0);
  }

  showForm(courseId: string, providerId: string) {
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
        this.renderer.listen(form, 'submit', (event) => this.handleSubmit(event, courseId, providerId));
      }
    }, 0);
  }

  handleSubmit(event: Event, courseId: string, providerId: string) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const userDetails = {
      name: formData.get('name') as string,
      age: formData.get('age') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
    this.initService.initUser(courseId, providerId, userDetails).subscribe(response => {
      if (response.status === 'success') {
        this.messages.push({ sender: 'bot', content: JSON.stringify(response.data, null, 2) });
        this.confirmOrder(courseId, providerId, userDetails);
      } else {
        this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
    });
  }

  confirmOrder(courseId: string, providerId: string, userDetails: any) {
    this.confirmService.confirmOrder(courseId, providerId, userDetails).subscribe(response => {
      if (response.status === 'success') {
        this.messages.push({ sender: 'bot', content: 'Enrollment confirmed successfully!' });
      } else {
        this.messages.push({ sender: 'bot', content: 'Confirmation failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Confirmation failed. Please try again.' });
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
