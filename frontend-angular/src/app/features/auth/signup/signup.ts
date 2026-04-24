import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  hidePassword = true;

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.signupForm.value as any).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000, panelClass: ['bg-green-600', 'text-white'] });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          const message = err.error?.message || err.message || 'Registration failed';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['bg-red-600', 'text-white'] });
        }
      });
    }
  }
}
