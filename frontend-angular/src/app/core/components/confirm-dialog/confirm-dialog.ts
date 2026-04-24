import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <mat-icon>warning</mat-icon>
        </div>
        <h2 class="text-xl font-bold text-gray-800 m-0">{{ data.title }}</h2>
      </div>
      
      <p class="text-gray-600 mb-6 ml-1">{{ data.message }}</p>
      
      <div class="flex justify-end gap-3">
        <button mat-stroked-button (click)="onCancel()" class="!rounded-xl">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button color="warn" (click)="onConfirm()" class="!rounded-xl">
          {{ data.confirmText || 'Delete' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
