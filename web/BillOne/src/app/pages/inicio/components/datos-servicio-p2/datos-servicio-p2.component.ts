import { Component } from '@angular/core';
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
  form: FormGroup;
  tokens: string[] = []; // Lista de tokens

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

  onAddToken() {
    if (this.form.valid) {
      const token = this.form.get('tokenBoleto')?.value;
      this.tokens.push(token); // Agrega el token a la lista
      this.form.get('tokenBoleto')?.reset(); // Limpia el campo
    } else {
      this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  removeToken(token: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `¿Está seguro de que desea eliminar el token "${token}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tokens = this.tokens.filter(t => t !== token); // Elimina el token si el usuario confirma
      }
    });
  }
}
