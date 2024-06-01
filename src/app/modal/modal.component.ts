import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() content: SafeHtml | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  nextAction() {
    this.next.emit();
  }
}
