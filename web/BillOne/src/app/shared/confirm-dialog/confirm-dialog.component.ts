import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">Confirmación</h2>
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button class="cancel-button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="warn" class="confirm-button" (click)="onConfirm()">Eliminar</button>
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
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo y devuelve "false"
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo y devuelve "true"
  }
}
