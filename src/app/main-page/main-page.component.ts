import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})

export class MainPageComponent {
  // typedText: string = ""; // Property to hold the text being typed
  // texts: string[] = [ // Array of texts to display
  //   "Paragraph 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   "Paragraph 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //   "Paragraph 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  // ];
  // index: number = 0; // Index to keep track of the current text
  // characterIndex: number = 0; // Index to keep track of the current character being typed
  // isDeleting: boolean = false; // Flag to indicate whether characters are being deleted

  // constructor() { }

  // ngOnInit(): void {
  //   this.type(); // Call the typewriter effect function on component initialization
  // }

  // type(): void {
  //   const text = this.texts[this.index]; // Get the current text from the array
  //   const typingSpeed = 100; // Speed of typing in milliseconds

  //   if (this.isDeleting) {
  //     this.characterIndex--; // If deleting, move back one character
  //   } else {
  //     this.characterIndex++; // Otherwise, move forward one character
  //   }

  //   // Get the partial text to display up to the current character
  //   const partialText = text.substring(0, this.characterIndex);
  //   this.typedText = partialText; // Update the property bound to the HTML element

  //   // Check if finished typing the current text
  //   if (!this.isDeleting && this.characterIndex === text.length) {
  //     this.isDeleting = true; // Set flag to start deleting characters
  //     setTimeout(() => this.type(), typingSpeed * 2); // Wait before starting to delete
  //   } else if (this.isDeleting && this.characterIndex === 0) {
  //     this.isDeleting = false; // Finished deleting, move to the next text
  //     this.index = (this.index + 1) % this.texts.length; // Loop through texts
  //     setTimeout(() => this.type(), typingSpeed); // Start typing the next text
  //   } else {
  //     setTimeout(() => this.type(), typingSpeed); // Continue typing characters
  //   }
  // }
}

