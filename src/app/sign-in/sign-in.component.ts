
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService }from '../AuthGuard/auth.guard';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  
  email = '';
  password = '';
  emailValid: boolean = true;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router,private authService: AuthService) {}
  

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onSubmit() {
    this.emailValid = this.validateEmail(this.email);

    if (!this.emailValid) {
      console.error('Invalid email format');
      return;
    }
    
    const signInData = {
      email: this.email,
      password: this.password,
    };

    //console.log(signInData);
    this.http.post('http://localhost:3000/api/auth/signin', signInData).subscribe(
      response => {
        console.log('Sign-in successful:', response);
        this.snackBar.open('Sign-in successful!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-success', 'text-white']
        });

        // Set authentication flag in local storage
       this.authService.login();
        //this.authService.getIsLoggedIn;

        // Redirect to chatbot page
        this.router.navigate(['/chatbot']);
      },
      error => {
        console.error('Sign-in error:', error);
        this.snackBar.open('Sign-in failed. Please try again.','Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-danger', 'text-white']
        });
      }
    );
  }
}
