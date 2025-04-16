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


@Component({
  selector: 'app-menu-proceso',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmarDatosComponent, DatosFiscalesComponent, DatosServicioComponent, FacturasEmitidasComponent,
    MatButtonModule, // Para botones de Angular Material
    MatIconModule, // Para íconos de Angular Material
    MatSlideToggleModule // Para el toggle de Angular Material
    , DatosServicioP2Component],
  templateUrl: './menu-proceso.component.html',
  styleUrl: './menu-proceso.component.scss'
})
export class MenuProcesoComponent {
  currentStep: number = 1; // Controla el paso actual
  currentStepDatosServicio: number = 1; // Controla el paso actual dentro de el proceso datos servicio
  showModal: boolean = false; // Controla la visibilidad del modal

  // Almacén de todos los datos del cliente
  formData = {
    datosServicio: {},
    datosFiscales: {},
    confirmarDatos: {}
  };

  // Referencias a los componentes hijos
  @ViewChild(DatosServicioComponent) datosServicioComponent!: DatosServicioComponent;
  @ViewChild(DatosFiscalesComponent) datosFiscalesComponent!: DatosFiscalesComponent;
  @ViewChild(ConfirmarDatosComponent) confirmarDatosComponent!: ConfirmarDatosComponent;
  @ViewChild(FacturasEmitidasComponent) facturasEmitidasComponent!: FacturasEmitidasComponent;

  constructor(private router: Router) {}

  setStep(step: number): void {
    this.currentStep = step; // Cambia al paso seleccionado
    this.currentStepDatosServicio = 1; // Reinicia el paso dentro de el proceso datos servicio
  }

  nextStepDatosServicio(): void {
    if (this.datosServicioComponent?.isValid()) {
      this.formData.datosServicio = this.datosServicioComponent.getData();
      console.log(this.formData);
      if (this.currentStepDatosServicio < 2) {
        this.currentStepDatosServicio++;
      } else {
        this.currentStep++; // Avanza al siguiente paso general si ya es el último subpaso
      }
    } else {
      alert('Completa correctamente los datos del servicio.');
    }
  }

  nextStep(): void {
    switch (this.currentStep) {
      case 1:
        if (this.datosServicioComponent?.isValid()) {
          this.formData.datosServicio = this.datosServicioComponent.getData();
          console.log(this.formData);
          this.currentStep++;
        } else {
          alert('Completa correctamente los datos fiscales.');
        }
        break;

      case 2:
        if (this.datosFiscalesComponent?.isValid()) {
          this.formData.datosFiscales = this.datosFiscalesComponent.getData();
          this.currentStep++;
        } else {
          alert('Completa correctamente los datos fiscales.');
        }
        break;
    }
  }

  showCancelModal(): void {
    this.showModal = true; // Muestra el modal
  }

  closeModal(): void {
    this.showModal = false; // Oculta el modal
  }

  cancel(): void {
    this.showModal = false; // Oculta el modal
    this.currentStep = 1; // Regresa al primer paso
    this.currentStepDatosServicio = 1; // Regresa al primer paso dentro de el proceso datos servicio
    this.router.navigate(['/inicio']);
  }
}
