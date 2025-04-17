import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-fiscales',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './datos-fiscales.component.html',
  styleUrl: './datos-fiscales.component.scss'
})
export class DatosFiscalesComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombreServicio: ['', Validators.required],
      descripcion: [''],
      fecha: ['', Validators.required]
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
