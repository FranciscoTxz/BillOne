import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmarDatosComponent } from '../confirmar-datos/confirmar-datos.component';
import { DatosFiscalesComponent } from '../datos-fiscales/datos-fiscales.component';
import { DatosServicioComponent } from '../datos-servicio/datos-servicio.component';
import { FacturasEmitidasComponent } from '../facturas-emitidas/facturas-emitidas.component';

@Component({
  selector: 'app-menu-proceso',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmarDatosComponent, DatosFiscalesComponent, DatosServicioComponent, FacturasEmitidasComponent],
  templateUrl: './menu-proceso.component.html',
  styleUrl: './menu-proceso.component.scss'
})
export class MenuProcesoComponent {
  currentStep: number = 1; // Controla el paso actual
  showModal: boolean = false; // Controla la visibilidad del modal

  constructor(private router: Router) {}

  setStep(step: number): void {
    this.currentStep = step; // Cambia al paso seleccionado
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++; // Avanza al siguiente paso
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
    this.router.navigate(['/inicio']);
  }
}
