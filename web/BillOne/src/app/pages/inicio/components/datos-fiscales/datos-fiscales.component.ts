import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-datos-fiscales',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule // Importa MatExpansionModule para el acordeón
  ],
  templateUrl: './datos-fiscales.component.html',
  styleUrl: './datos-fiscales.component.scss'
})
export class DatosFiscalesComponent {
  @Input() tokens: any[] = []; // Recibe los tokens desde el componente padre
  @Output() accordionStateChange = new EventEmitter<boolean>(); // Emite true si se abre, false si se cierra

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rfc: ['', Validators.required],
      nombre: ['', Validators.required],
      regimen: ['', Validators.required],
      usoCfdi: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cp: ['', Validators.required],
      estado: ['', Validators.required],
      ciudad: ['', Validators.required],
      colonia: ['', Validators.required],
      calle: ['', Validators.required],
      numExt: ['', Validators.required],
      numInt: [''],
      formaPago: ['', Validators.required]
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

  onAccordionOpened(): void {
    this.accordionStateChange.emit(true); // Notifica que el acordeón se abrió
  }

  onAccordionClosed(): void {
    this.accordionStateChange.emit(false); // Notifica que el acordeón se cerró
  }
}
