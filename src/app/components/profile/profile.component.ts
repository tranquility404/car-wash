import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileUpdateForm: FormGroup;
  passwordChangeForm: FormGroup;
  isUpdatingProfile = false;
  isChangingPassword = false;
  isEditMode = false;
  showPasswordSection = false;
  originalFormData: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiMagician: ApiService
  ) {
    this.profileUpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });

    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Using demo data for now
    this.loadDemoData();
    // Uncomment below to use real API data
    // this.loadRealData();
  }

  loadDemoData() {
    // Set demo user profile data
    const demoUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      address: '123 Main Street, Anytown, ST 12345'
    };

    this.profileUpdateForm.patchValue(demoUser);
    // Store as original data for cancel functionality
    this.originalFormData = { ...demoUser };
    console.log('Demo profile data loaded');
  }

  loadRealData() {
    // Load actual user profile data from API
    // Note: Add getCurrentUser method to ApiService when backend is ready
    console.log('Real profile data loading not implemented yet - add getCurrentUser to ApiService');

    // Example implementation when API is ready:
    // this.apiMagician.getCurrentUser().subscribe(
    //   (user: User) => {
    //     this.profileUpdateForm.patchValue({
    //       name: user.name,
    //       email: user.email,
    //       phone: user.phone || '',
    //       address: user.address || ''
    //     });
    //     console.log('Real profile data loaded:', user);
    //   },
    //   (error: any) => {
    //     console.error('Failed to load user profile:', error);
    //   }
    // );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  updateMyAwesomeProfile() {
    if (this.profileUpdateForm.valid) {
      this.isUpdatingProfile = true;
      const userToUpdate: User = this.profileUpdateForm.value;

      // Using demo mode - simulate API call with timeout
      setTimeout(() => {
        console.log('Profile updated successfully (demo):', userToUpdate);
        this.isUpdatingProfile = false;
        this.isEditMode = false; // Exit edit mode after successful update
        // Update original data to new values
        this.originalFormData = { ...this.profileUpdateForm.value };
        alert('Profile updated successfully! 🎉');
      }, 1500); // Simulate API delay

      // Uncomment below to use real API
      // this.updateMyAwesomeProfileReal(userToUpdate);
    }
  } updateMyAwesomeProfileReal(userToUpdate: User) {
    this.apiMagician.updateUser(userToUpdate).subscribe(
      (updatedUser) => {
        console.log('Profile updated successfully:', updatedUser);
        this.isUpdatingProfile = false;
        this.isEditMode = false; // Exit edit mode after successful update
        // Update original data to new values
        this.originalFormData = { ...this.profileUpdateForm.value };
        alert('Profile updated successfully! 🎉');
      },
      (error) => {
        console.error('Failed to update profile:', error);
        this.isUpdatingProfile = false;
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  changeMySecretCode() {
    if (this.passwordChangeForm.valid) {
      this.isChangingPassword = true;
      const { oldPassword, newPassword } = this.passwordChangeForm.value;

      // Using demo mode - simulate API call with timeout
      setTimeout(() => {
        console.log('Password changed successfully (demo)');
        this.isChangingPassword = false;
        this.passwordChangeForm.reset();
        alert('Password changed successfully! 🔒');
      }, 2000); // Simulate API delay

      // Uncomment below to use real API
      // this.changeMySecretCodeReal(oldPassword, newPassword);
    }
  }

  changeMySecretCodeReal(oldPassword: string, newPassword: string) {
    this.apiMagician.changePassword(oldPassword, newPassword).subscribe(
      (response) => {
        console.log('Password changed successfully:', response);
        this.isChangingPassword = false;
        this.passwordChangeForm.reset();
        alert('Password changed successfully! 🔒');
      },
      (error) => {
        console.error('Failed to change password:', error);
        this.isChangingPassword = false;
        alert('Failed to change password. Please check your current password.');
      }
    );
  }

  enableEditMode() {
    this.isEditMode = true;
    // Store original form data for cancel functionality
    this.originalFormData = { ...this.profileUpdateForm.value };
    console.log('Edit mode enabled');
  }

  cancelEdit() {
    this.isEditMode = false;
    // Restore original form data
    this.profileUpdateForm.patchValue(this.originalFormData);
    console.log('Edit mode cancelled, data restored');
  }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    if (this.showPasswordSection) {
      // Reset password form when opening
      this.passwordChangeForm.reset();
    }
    console.log('Password section toggled:', this.showPasswordSection);
  }
}