import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">Aviso</h2>
      <mat-dialog-content class="dialog-content">
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      <mat-dialog-actions align="center" class="dialog-actions">
        <button mat-raised-button color="primary" class="confirm-button" (click)="onConfirm()">
          {{ data.confirmText || 'Estoy de acuerdo' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      message: string; 
      confirmText?: string; 
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo y devuelve "true"
  }
}
