import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: any): boolean {
        const requiredRole = route.data?.role;

        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }

        if (requiredRole && this.authService.hasRole(requiredRole)) {
            return true;
        } else {
            // Redirect to appropriate dashboard based on user role
            const userRole = this.authService.getRole();
            this.authService.redirectBasedOnRole(userRole || 'USER');
            return false;
        }
    }
}
