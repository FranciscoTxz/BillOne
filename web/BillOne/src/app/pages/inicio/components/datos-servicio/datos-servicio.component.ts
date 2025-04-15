import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-servicio',
  standalone: true,
  imports: [ReactiveFormsModule],
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
