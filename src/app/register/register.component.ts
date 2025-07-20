import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user = {
    username: '',
    email: '',
    password: '',
    role:''
  };

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log('Register Form Submitted');
    console.log('Username:', this.user.username);
    console.log('Email:', this.user.email);
    console.log('Password:', this.user.password);
    console.log('Role:', this.user.role);  // Log role
    this.onRegister();
  }

  onRegister() {
  this.authService.register(this.user).subscribe(
    response => {
      alert('Registration successful!');
      console.log(response);
    },
    error => {
      alert('Registration failed.');
      console.error(error);
    }
  );
}

}