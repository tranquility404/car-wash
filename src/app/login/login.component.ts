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
          console.log('Login response:', response);
          
          // Try to parse the response to extract token and role
          try {
            let authData;
            
            // Check if response is already an object
            if (typeof response === 'object') {
              authData = response;
            } else {
              // Try to parse as JSON
              authData = JSON.parse(response);
            }
            
            // Save token and role to localStorage
            if (authData.token) {
              localStorage.setItem('jwt_token', authData.token);
              console.log('Token saved to localStorage');
            }
            
            if (authData.role) {
              localStorage.setItem('user_role', authData.role);
              console.log('Role saved to localStorage:', authData.role);
            }
            
            // If no structured response, try to extract from JWT payload
            if (!authData.role && authData.token) {
              try {
                const payload = JSON.parse(atob(authData.token.split('.')[1]));
                const role = payload.role || payload.authorities?.[0] || 'USER';
                localStorage.setItem('user_role', role);
                console.log('Role extracted from JWT and saved:', role);
              } catch (jwtError) {
                console.warn('Could not decode JWT payload, defaulting to USER role');
                localStorage.setItem('user_role', 'USER');
              }
            }
            
            alert('Login successful!');
            
            // Redirect based on role
            const userRole = localStorage.getItem('user_role') || 'USER';
            this.redirectBasedOnRole(userRole);
            
          } catch (parseError) {
            // If response is just a plain token string
            console.log('Response is likely a plain token string');
            localStorage.setItem('jwt_token', response);
            localStorage.setItem('user_role', 'USER'); // Default role
            
            alert('Login successful!');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          alert('Login failed.');
          console.error('Login error:', error);
        }
      });
  }

  // Helper method to redirect based on role
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'WASHER':
        this.router.navigate(['/washer-dashboard']);
        break;
      case 'USER':
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
// email: this.user.email, password: this.user.password 