import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { Student } from '../../core/models/student.model';
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatProgressSpinnerModule, 
    MatTooltipModule, MatDialogModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<Student>([]);
  displayedColumns: string[] = ['name', 'email', 'phone', 'course', 'enrollmentDate', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        const students = Array.isArray(data) ? data : (data as any).$values || [];
        this.dataSource.data = students;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000 });
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        }
      }
    });
  }

  deleteStudent(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Student',
        message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
            this.loadStudents();
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to delete student', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
