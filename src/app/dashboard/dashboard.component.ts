import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
    constructor(private authService: AuthService, private router: Router) { }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    hasRole(role: string): boolean {
        return this.authService.hasRole(role);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
