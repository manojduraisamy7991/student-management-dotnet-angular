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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  hidePassword = true;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000, panelClass: ['bg-green-600', 'text-white'] });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          const message = err.error?.message || err.message || 'Login failed';
          this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['bg-red-600', 'text-white'] });
        }
      });
    }
  }
}
