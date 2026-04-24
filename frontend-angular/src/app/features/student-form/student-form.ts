import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  studentId: number | null = null;

  studentForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    course: ['', Validators.required],
    enrollmentDate: [new Date(), Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number) {
    this.isLoading = true;
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          phone: student.phone,
          course: student.course,
          enrollmentDate: new Date(student.enrollmentDate)
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Failed to load student', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.isSaving = true;
      const formValue = this.studentForm.value;

      const payload = {
        name: formValue.name!,
        email: formValue.email!,
        phone: formValue.phone!,
        course: formValue.course!,
        enrollmentDate: new Date(formValue.enrollmentDate!).toISOString()
      };

      if (this.isEditMode && this.studentId) {
        this.studentService.updateStudent(this.studentId, payload).subscribe({
          next: () => {
            this.isSaving = false;
            this.snackBar.open('Student updated successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.isSaving = false;
            this.cdr.detectChanges();
            this.snackBar.open(err.error?.message || 'Failed to update student', 'Close', { duration: 5000 });
          }
        });
      } else {
        this.studentService.addStudent(payload).subscribe({
          next: () => {
            this.isSaving = false;
            this.snackBar.open('Student added successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.isSaving = false;
            this.cdr.detectChanges();
            this.snackBar.open(err.error?.message || 'Failed to add student', 'Close', { duration: 5000 });
          }
        });
      }
    }
  }
}
