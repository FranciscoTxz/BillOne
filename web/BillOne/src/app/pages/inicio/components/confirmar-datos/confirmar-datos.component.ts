import { NgFor, CommonModule, CurrencyPipe } from '@angular/common'; // Importa CommonModule y CurrencyPipe
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs'; // Importa MatTabsModule

@Component({
  selector: 'app-confirmar-datos',
  standalone: true,
  templateUrl: './confirmar-datos.component.html',
  styleUrl: './confirmar-datos.component.scss',
  imports: [NgFor, CommonModule, MatChipsModule, MatTabsModule], // Agrega MatTabsModule
})
export class ConfirmarDatosComponent {
  @Input() datosFiscales: any = {}; // Recibe los datos fiscales desde el componente padre
  @Input() tokens: any[] = []; // Recibe la lista de tokens desde el componente padre
}
