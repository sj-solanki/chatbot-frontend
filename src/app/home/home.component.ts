import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../AuthGuard/auth.guard';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isHomePage: boolean = true;

  constructor(private router: Router,private authService: AuthService) {}
  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/';
      }
    });
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }
  

  

  

  // Function to check if the user is logged in
  checkIsLoggedIn(): boolean {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    return this.isLoggedIn;
  }

  // Function to log out the user
  logout(): void {
    this.authService.logout();
  }
}
