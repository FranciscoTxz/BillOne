import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa ReactiveFormsModule y Validators
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatSelectModule } from '@angular/material/select'; // Importa MatSelectModule
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule para los inputs de texto
import { MatIconModule } from '@angular/material/icon'; // Importa MatIconModule para los íconos
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como *ngIf y *ngFor
import { RouterModule } from '@angular/router'; // Importa RouterModule para navegación
import { AbstractControl, ValidationErrors } from '@angular/forms'; // Importa para validadores personalizados

@Component({
  selector: 'app-recuperar-cfdi',
  standalone: true,
  templateUrl: './recuperar-cfdi.component.html',
  styleUrls: ['./recuperar-cfdi.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule, // Agrega MatInputModule aquí
    MatIconModule,
    RouterModule,
  ],
})
export class RecuperarCfdiComponent {
  form: FormGroup;
  mostrarOpcionesAdicionales = false; // Controla la visibilidad de las opciones adicionales
  mostrarTercerSelect = false; // Controla la visibilidad del tercer campo
  mostrarBotonBuscar = false; // Controla la visibilidad del botón de búsqueda

  // Labels dinámicos
  labelOpcionAdicional = '';
  labelDetalle = '';
  labelTercerDetalle = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      tipoServicio: ['', Validators.required], // Control para el select principal
      opcionAdicional: ['', Validators.required], // Control para el primer campo adicional
      detalle: ['', Validators.required], // Control para el segundo campo adicional
      tercerDetalle: [''], // Control para el tercer campo adicional (opcional)
      rfcCliente: ['', [Validators.required, this.rfcValidator]], // Campo para RFC con validación personalizada
    });
  }

  // Validador personalizado para RFC
  rfcValidator(control: AbstractControl): ValidationErrors | null {
    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/; // Expresión regular para validar RFC
    const value = control.value;
    if (value && !rfcPattern.test(value)) {
      return { invalidRFC: 'El RFC no tiene un formato válido' };
    }
    return null;
  }

  onEmpresaChange(value: string) {
    // Limpia los valores de los campos adicionales
    this.form.get('opcionAdicional')?.reset();
    this.form.get('detalle')?.reset();
    this.form.get('tercerDetalle')?.reset();

    // Muestra las opciones adicionales para todas las selecciones
    this.mostrarOpcionesAdicionales = true;

    // Configura los labels dinámicos y aplica validaciones según la selección
    switch (value) {
      case 'ttur':
        this.labelOpcionAdicional = 'Número de Contrato';
        this.labelDetalle = 'RFC Cliente';
        this.mostrarTercerSelect = false;

        // Aplica validación de RFC al campo "detalle"
        this.form.get('detalle')?.setValidators([Validators.required, this.rfcValidator]);
        this.form.get('detalle')?.updateValueAndValidity();

        // Elimina validaciones de RFC de otros campos
        this.form.get('opcionAdicional')?.clearValidators();
        this.form.get('opcionAdicional')?.setValidators([Validators.required]);
        this.form.get('opcionAdicional')?.updateValueAndValidity();
        break;

      case 'envios-primera-plus':
        this.labelOpcionAdicional = 'Token';
        this.labelDetalle = 'RFC Cliente';
        this.mostrarTercerSelect = false;

        // Aplica validación de RFC al campo "detalle"
        this.form.get('detalle')?.setValidators([Validators.required, this.rfcValidator]);
        this.form.get('detalle')?.updateValueAndValidity();

        // Elimina validaciones de RFC de otros campos
        this.form.get('opcionAdicional')?.clearValidators();
        this.form.get('opcionAdicional')?.setValidators([Validators.required]);
        this.form.get('opcionAdicional')?.updateValueAndValidity();
        break;

      case 'paqueteria-mensajeria-flecha-amarilla':
        this.labelOpcionAdicional = 'Prefijo';
        this.labelDetalle = 'Número de Guía';
        this.labelTercerDetalle = 'RFC Cliente';
        this.mostrarTercerSelect = true;

        // Aplica validación de RFC al campo "tercerDetalle"
        this.form.get('tercerDetalle')?.setValidators([Validators.required, this.rfcValidator]);
        this.form.get('tercerDetalle')?.updateValueAndValidity();

        // Elimina validaciones de RFC de otros campos
        this.form.get('detalle')?.clearValidators();
        this.form.get('detalle')?.setValidators([Validators.required]);
        this.form.get('detalle')?.updateValueAndValidity();
        break;

      case 'boletos-autobus':
        this.labelOpcionAdicional = 'RFC Cliente';
        this.labelDetalle = 'Token';
        this.mostrarTercerSelect = false;

        // Aplica validación de RFC al campo "opcionAdicional"
        this.form.get('opcionAdicional')?.setValidators([Validators.required, this.rfcValidator]);
        this.form.get('opcionAdicional')?.updateValueAndValidity();

        // Elimina validaciones de RFC de otros campos
        this.form.get('detalle')?.clearValidators();
        this.form.get('detalle')?.setValidators([Validators.required]);
        this.form.get('detalle')?.updateValueAndValidity();
        break;

      case 'consumo-alimentos':
        this.labelOpcionAdicional = 'RFC Cliente';
        this.labelDetalle = 'Ticket';
        this.mostrarTercerSelect = false;

        // Aplica validación de RFC al campo "opcionAdicional"
        this.form.get('opcionAdicional')?.setValidators([Validators.required, this.rfcValidator]);
        this.form.get('opcionAdicional')?.updateValueAndValidity();

        // Elimina validaciones de RFC de otros campos
        this.form.get('detalle')?.clearValidators();
        this.form.get('detalle')?.setValidators([Validators.required]);
        this.form.get('detalle')?.updateValueAndValidity();
        break;

      default:
        this.labelOpcionAdicional = '';
        this.labelDetalle = '';
        this.labelTercerDetalle = '';
        this.mostrarTercerSelect = false;

        // Limpia validaciones de todos los campos
        this.form.get('opcionAdicional')?.clearValidators();
        this.form.get('detalle')?.clearValidators();
        this.form.get('tercerDetalle')?.clearValidators();
        this.form.get('opcionAdicional')?.updateValueAndValidity();
        this.form.get('detalle')?.updateValueAndValidity();
        this.form.get('tercerDetalle')?.updateValueAndValidity();
    }

    // Llama a onSelectChange para verificar si se deben mostrar todos los campos
    this.onSelectChange();
  }

  onSelectChange() {
    // Verifica si todos los campos requeridos están completos
    const tipoServicio = this.form.get('tipoServicio')?.value;
    const opcionAdicional = this.form.get('opcionAdicional')?.value;
    const detalle = this.form.get('detalle')?.value;
    const tercerDetalle = this.mostrarTercerSelect ? this.form.get('tercerDetalle')?.value : true;

    // Actualiza la visibilidad del botón
    this.mostrarBotonBuscar = !!tipoServicio && !!opcionAdicional && !!detalle && !!tercerDetalle;
  }

  ngOnInit() {
    // Escucha los cambios en el formulario para actualizar la visibilidad del botón
    this.form.valueChanges.subscribe(() => {
      this.onSelectChange();
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // Aquí puedes manejar la lógica para buscar la factura
      console.log('Formulario válido. Buscando factura...', this.form.value);
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
      console.log('Formulario inválido. Por favor, complete todos los campos.');
    }
  }
}
