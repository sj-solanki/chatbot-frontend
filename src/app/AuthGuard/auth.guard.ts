// // auth.service.ts
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private isLoggedIn: boolean = false;

//   constructor() {}

//   // Function to check if the user is logged in
//   public getIsLoggedIn(): boolean {
//     return this.isLoggedIn;
//   }

//   // Function to set the user as logged in
//   public login(): void {
//     this.isLoggedIn = true;
//   }

//   // Function to set the user as logged out
//   public logout(): void {
//     this.isLoggedIn = false;
//     // Add any additional logout logic here, such as clearing session data, etc.
//   }
// }


// auth.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  // Function to check if the user is logged in
  public getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  // Function to set the user as logged in
  public login(): void {
    this.isLoggedIn = true;
  }

  // Function to set the user as logged out
  public logout(): void {
    this.isLoggedIn = false;
    // Add any additional logout logic here, such as clearing session data, etc.
  }

  // Implement canActivate method to control route activation
  canActivate(): boolean {
    if (this.isLoggedIn) {
      return true; // Allow access to the route if user is logged in
    } else {
      this.router.navigate(['/sign-in']); // Redirect to sign-in page if not logged in
      return false;
    }
  }
}
