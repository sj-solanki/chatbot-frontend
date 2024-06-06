// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// //import { AuthService }from '../AuthGuard/auth.guard';

// @Component({
//   selector: 'app-sign-up',
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })
// export class SignUpComponent {
//   name = '';
//   email = '';
//   password = '';

//   onSubmit() {
//     // Implement sign-up logic here

//     const signUpData = {
//       name: this.name,
//       email: this.email,
//       password: this.password
//     };
//     console.log(signUpData);

//     this.http.post('http://localhost:3000/api/auth/register', signUpData).subscribe(
//       response => {
//         console.log('Sign-up successful:', response);
//         this.snackBar.open('Sign-up successful!', 'Close', {
//           duration: 3000,
//           verticalPosition: 'top',
//           horizontalPosition: 'center',


//           panelClass: ['bg-success', 'text-white']
//         });

//         // Set authentication flag in local storage
//         //this.authService.login();

//         // Redirect to chatbot page
//         this.router.navigate(['/chatbot']);
//       },
//       error => {
//         console.error('Sign-up error:', error);
//         this.snackBar.open('Sign-up failed. Please try again.', 'Close', {
//           duration: 3000,
//           verticalPosition: 'top',
//           horizontalPosition: 'center',
//           panelClass: ['bg-danger', 'text-white']
//         });
//       }
//     );
  
//   }
// }

// sign-up.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService }from '../AuthGuard/auth.guard';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';
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

    const signUpData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    //console.log(signUpData);
    this.http.post('http://localhost:3000/api/auth/register', signUpData).subscribe(
      response => {
        console.log('Sign-up successful:', response);
        this.snackBar.open('Sign-up successful!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-success', 'text-white']
        });

        // Set authentication flag in local storage
        this.authService.login();

        // Redirect to chatbot page
        this.router.navigate(['/chatbot']);
      },
      error => {
        console.error('Sign-up error:', error);
        this.snackBar.open('Sign-up failed. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-danger', 'text-white']
        });
      }
    );
  }
}


