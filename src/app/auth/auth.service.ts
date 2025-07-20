import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/user';

  constructor(private http: HttpClient, private router: Router) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' });
  }

  login(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`)
    });

    return this.http.post(`${this.baseUrl}/login`, user, { headers, responseType: 'text' })
      .pipe(
        tap(response => {
          // Handle different response formats from your backend
          try {
            // Try to parse as JSON first
            const authData = JSON.parse(response);
            if (authData.token && authData.role) {
              this.saveTokenAndRole(authData.token, authData.role);
              this.redirectBasedOnRole(authData.role);
            }
          } catch (error) {
            // If response is just a token string or different format
            console.log('Login response:', response);

            // For demo purposes, assuming response is a token and defaulting to USER role
            // You should modify this based on your actual backend response
            if (response && response.trim() !== '') {
              // Assuming the response is just a JWT token
              const token = response.trim();

              // You might need to decode the JWT or make another API call to get the role
              // For now, let's assume USER role (modify based on your needs)
              let role = 'USER';

              // If you have role info in JWT payload, decode it here
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                role = payload.role || payload.authorities?.[0] || 'USER';
              } catch (decodeError) {
                console.warn('Could not decode JWT payload, defaulting to USER role');
              }

              this.saveTokenAndRole(token, role);
              this.redirectBasedOnRole(role);
            }
          }
        })
      );
  }

  saveTokenAndRole(token: string, role: string): void {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    // For demo purposes, always return true
    return true;

    // Uncomment the lines below for actual authentication checking
    // const token = this.getToken();
    // return token !== null && token !== '';
  }

  hasRole(role: string): boolean {
    // For demo purposes, let's default to USER role
    // You can change this to 'ADMIN' or 'WASHER' to test different dashboard views
    const demoRole = 'USER'; // Change this to test different roles: 'USER', 'ADMIN', 'WASHER'
    return demoRole === role;

    // Uncomment the lines below for actual role checking
    // const userRole = this.getRole();
    // return userRole === role;
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
  }

  redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'USER':
        this.router.navigate(['/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'WASHER':
        this.router.navigate(['/washer-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  // Method to get user profile information (if you need to make a separate API call)
  getUserProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }
}