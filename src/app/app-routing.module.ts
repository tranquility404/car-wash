import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// Import components
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { WasherDashboardComponent } from './components/washer-dashboard/washer-dashboard.component';
import { CarsComponent } from './components/cars/cars.component';
import { CartsComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrdersComponent } from './components/orders/orders.component';

// Import guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  // Public routes - accessible to everyone
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'cars', component: CarsComponent, canActivate: [AuthGuard] },
      { path: 'carts', component: CartsComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },

    ]
   },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes - require authentication and specific roles
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [RoleGuard],
  //   data: { role: 'USER' }
  // },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'washer-dashboard',
    component: WasherDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'WASHER' }
  },

  // Other protected routes - require authentication

  // Default redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Wildcard route - must be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
