import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa para mat-form-field
import { MatInputModule } from '@angular/material/input'; // Importa para matInput
import { MatIconModule } from '@angular/material/icon'; // Importa para mat-icon
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component'; // Importa el componente del diálogo
import { MatDialogModule } from '@angular/material/dialog'; // Importa MatDialogModule

interface Token {
  concepto: string;
  precio: number;
  token: string;
}

@Component({
  selector: 'app-datos-servicio-p2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, // Agregado para mat-icon
    MatDialogModule // Importa MatDialogModule
  ],
  templateUrl: './datos-servicio-p2.component.html',
  styleUrls: ['./datos-servicio-p2.component.scss']
})
export class DatosServicioP2Component {
  @Output() tokenAdded = new EventEmitter<any>(); // Emite el token al padre

  form: FormGroup;
  tokens = [
    { concepto: 'Concepto 1 Concepto 1Concepto 1Concepto 1Concepto 1Concepto 1Concepto 1Concepto 1Concepto 1Concepto 1', precio: 100, token: 'ABC123' },
    { concepto: 'Concepto 2', precio: 200, token: 'DEF456' }
  ]; // Lista de tokens

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      rfcCliente: [
        '',
        [Validators.required, Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i)] // Valida RFC
      ],
      tokenBoleto: ['', Validators.required], // Campo requerido
      aceptaAviso: [false, Validators.requiredTrue] // Debe ser true para ser válido
    });
  }

  onAddToken(): void {
    const newToken: Token = {
      concepto: this.form.get('concepto')?.value || 'Nuevo Concepto',
      precio: this.form.get('precio')?.value || 0,
      token: this.form.get('tokenBoleto')?.value
    };

    if (newToken.token) {
      this.tokens.push(newToken);
      this.tokenAdded.emit(newToken); // Emite el token al componente padre
      this.form.get('tokenBoleto')?.reset(); // Limpia el campo del token
    }
  }

  removeToken(token: any): void {
    this.tokens = this.tokens.filter(t => t !== token);
  }
}
