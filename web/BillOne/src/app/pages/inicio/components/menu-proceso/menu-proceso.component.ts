// Importaciones necesarias para el componente
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmarDatosComponent } from '../confirmar-datos/confirmar-datos.component';
import { DatosFiscalesComponent } from '../datos-fiscales/datos-fiscales.component';
import { DatosServicioComponent } from '../datos-servicio/datos-servicio.component';
import { FacturasEmitidasComponent } from '../facturas-emitidas/facturas-emitidas.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatosServicioP2Component } from "../datos-servicio-p2/datos-servicio-p2.component";

interface Token {
  concepto: string;
  precio: number;
  token: string;
}

// Decorador del componente
@Component({
  selector: 'app-menu-proceso', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [
    RouterModule, 
    CommonModule, 
    ConfirmarDatosComponent, 
    DatosFiscalesComponent, 
    DatosServicioComponent, 
    FacturasEmitidasComponent,
    MatButtonModule, // Para botones de Angular Material
    MatIconModule, // Para íconos de Angular Material
    MatSlideToggleModule, // Para el toggle de Angular Material
    DatosServicioP2Component // Componente hijo para el segundo paso de datos de servicio
  ],
  templateUrl: './menu-proceso.component.html', // Ruta del archivo HTML del componente
  styleUrl: './menu-proceso.component.scss' // Ruta del archivo SCSS del componente
})
export class MenuProcesoComponent {
  // Variables para controlar el flujo del proceso
  currentStep: number = 1; // Controla el paso actual del proceso principal
  currentStepDatosServicio: number = 1; // Controla el paso actual dentro del proceso de datos de servicio
  showModal: boolean = false; // Controla la visibilidad del modal
  isAccordionExpanded: boolean = false; // Estado del acordeón

  // Objeto para almacenar los datos del cliente en diferentes pasos
  formData = {
    datosServicio: {
      tokens: [] as Token[] // Define el tipo del array como Token[]
    },
    datosFiscales: {
      rfc: '',
      nombre: '',
      regimen: '',
      usoCfdi: '',
      cp: '',
      estado: '',
      ciudad: '',
      colonia: '',
      calle: '',
      numExt: '',
      numInt: '',
      correos: [] as string[] // Agrega un campo para los correos electrónicos
    },
    confirmarDatos: {} // Datos de confirmación
  };

  // Referencias a los componentes hijos para acceder a sus métodos y datos
  @ViewChild(DatosServicioComponent) datosServicioComponent!: DatosServicioComponent;
  @ViewChild(DatosFiscalesComponent) datosFiscalesComponent!: DatosFiscalesComponent;
  @ViewChild(ConfirmarDatosComponent) confirmarDatosComponent!: ConfirmarDatosComponent;
  @ViewChild(FacturasEmitidasComponent) facturasEmitidasComponent!: FacturasEmitidasComponent;
  @ViewChild(DatosServicioP2Component) datosServicioP2Component!: DatosServicioP2Component;

  // Constructor para inyectar el servicio de enrutamiento
  constructor(private router: Router) {}

  // Método para cambiar al paso seleccionado
  setStep(step: number): void {
    this.currentStep = step; // Cambia al paso principal seleccionado
    this.currentStepDatosServicio = 1; // Reinicia el paso dentro del proceso de datos de servicio
  }

  // Método para avanzar dentro del proceso de datos de servicio
  nextStepDatosServicio(): void {
    if (this.currentStepDatosServicio === 1) {
      // Validación para el primer subpaso
      if (this.datosServicioComponent?.isValid()) {
        this.formData.datosServicio = this.datosServicioComponent.getData(); // Guarda los datos del servicio
        console.log(this.formData);
        this.currentStepDatosServicio++; // Avanza al siguiente subpaso
      } else {
        alert('Completa correctamente los datos del servicio.'); // Muestra un mensaje de error
      }
    } else if (this.currentStepDatosServicio === 2) {
      // Validación para el segundo subpaso (tokens y checkbox)
      const hasTokens = this.datosServicioP2Component?.tokens.length > 0; // Verifica si hay tokens registrados
      const isCheckboxChecked = this.datosServicioP2Component?.form.get('aceptaAviso')?.value; // Verifica si el checkbox está seleccionado

      if (hasTokens && isCheckboxChecked) {
        this.formData.datosServicio.tokens = this.datosServicioP2Component.tokens; // Guarda los tokens en los datos del formulario
        console.log('Tokens registrados:', this.formData.datosServicio.tokens); // Muestra los tokens registrados
        this.currentStep++; // Avanza al siguiente paso general
      } else {
        if (!hasTokens) {
          alert('Debe registrar al menos un token en la lista.'); // Muestra un mensaje de error si no hay tokens
        }
        if (!isCheckboxChecked) {
          alert('Debe aceptar el aviso de privacidad.'); // Muestra un mensaje de error si el checkbox no está seleccionado
        }
      }
    }
  }

  // Método para avanzar al siguiente paso general
  nextStep(): void {
    switch (this.currentStep) {
      case 1:
        // Validación para el primer paso
        if (this.datosServicioComponent?.isValid()) {
          this.formData.datosServicio = this.datosServicioComponent.getData(); // Guarda los datos del servicio
          console.log('Datos del servicio:', this.formData.datosServicio);
          this.currentStep++; // Avanza al siguiente paso
        } else {
          alert('Completa correctamente los datos del servicio.'); // Muestra un mensaje de error
        }
        break;

      case 2:
        // Validación para el segundo paso
        if (this.datosFiscalesComponent?.isValid()) {
          this.formData.datosFiscales = this.datosFiscalesComponent.getData(); // Guarda los datos fiscales, incluidos los correos
          console.log('Datos fiscales:', this.formData.datosFiscales);
          this.currentStep++; // Avanza al siguiente paso
        } else {
          //alert('Completa correctamente los datos fiscales.'); // Muestra un mensaje de error
        }
        break;

      case 3:
        // Validación para el tercer paso (Confirmar datos)
/*        /*if (this.confirmarDatosComponent?.isValid()) {
          this.formData.confirmarDatos = this.confirmarDatosComponent.getData(); // Guarda los datos de confirmación
          console.log('Datos confirmados:', this.formData.confirmarDatos);
          this.currentStep++; // Avanza al siguiente paso
        } else {
          alert('Revisa y confirma los datos antes de continuar.'); // Muestra un mensaje de error
        }*/
        break;

      case 4:
        // Paso final (Facturas emitidas)
        console.log('Proceso completado. Datos finales:', this.formData);
        alert('¡Proceso completado con éxito!'); // Muestra un mensaje de éxito
        this.router.navigate(['/inicio']); // Redirige al inicio
        break;

      default:
        console.log('Paso no reconocido:', this.currentStep); // Manejo de errores para pasos no reconocidos
        break;
    }
  }

  // Método para mostrar el modal de cancelación
  showCancelModal(): void {
    this.showModal = true; // Muestra el modal
  }

  // Método para cerrar el modal de cancelación
  closeModal(): void {
    this.showModal = false; // Oculta el modal
  }

  // Método para cancelar el proceso y regresar al inicio
  cancel(): void {
    this.showModal = false; // Oculta el modal
    this.currentStep = 1; // Regresa al primer paso
    this.currentStepDatosServicio = 1; // Regresa al primer subpaso dentro del proceso de datos de servicio
    this.router.navigate(['/inicio']); // Redirige al inicio
  }

  get tokens(): any[] {
    return this.formData.datosServicio.tokens || [];
  }

  onAccordionStateChange(isExpanded: boolean): void {
    this.isAccordionExpanded = isExpanded; // Actualiza el estado del acordeón
  }
}
