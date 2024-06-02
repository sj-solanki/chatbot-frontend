import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() responses: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  nextAction() {
    this.next.emit();
  }
}
