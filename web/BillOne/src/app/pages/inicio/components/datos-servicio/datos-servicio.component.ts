import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y *ngFor
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-datos-servicio',
  standalone: true,
  imports: [
    CommonModule, // Necesario para directivas como *ngIf y *ngFor
    ReactiveFormsModule, // Para formularios reactivos
    MatButtonModule, // Para botones de Angular Material
    MatIconModule, // Para íconos de Angular Material
    MatSlideToggleModule, // Para el toggle de Angular Material
    MatFormFieldModule, // Para el campo de formulario de Angular Material
    MatSelectModule // Para el select de Angular Material
  ],
  templateUrl: './datos-servicio.component.html',
  styleUrls: ['./datos-servicio.component.scss']
})
export class DatosServicioComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      tipoServicio: ['', Validators.required] // Campo para el select
    });
  }

  // Expone si el formulario es válido
  isValid(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  // Expone los datos del formulario
  getData(): any {
    return this.form.value;
  }
}
