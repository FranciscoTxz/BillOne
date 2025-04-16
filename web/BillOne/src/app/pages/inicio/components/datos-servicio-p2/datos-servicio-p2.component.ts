import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-servicio-p2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './datos-servicio-p2.component.html',
  styleUrls: ['./datos-servicio-p2.component.scss']
})
export class DatosServicioP2Component {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
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
      console.log('Formulario válido:', this.form.value);
      // Lógica para agregar el token
    } else {
      this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }
}
