import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Optional, if you have styles
})
export class LoginComponent {

  // Declare the user object for login
  user = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  // Handle form submission
  onSubmit() {
    console.log('Login Form Submitted');
    console.log('Username:', this.user.username);
    console.log('Password:', this.user.password);
    this.onLogin();  // Call the login logic
  }

  // Login logic
  onLogin() {
    this.authService.login(this.user)
      .subscribe({
        next: (response) => {
          alert('Login successful!');
          console.log(response);
          // Token and role saving is handled in the AuthService
          // Redirection is also handled in the AuthService based on role
        },
        error: (error) => {
          alert('Login failed.');
          console.error(error);
        }
      });
  }
}
// email: this.user.email, password: this.user.password 