import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select'; // Para los selectores
import { MatButtonModule } from '@angular/material/button'; // Opcional: Para botones si los usas
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {ChangeDetectionStrategy, inject, signal} from '@angular/core';
import {MatChipEditedEvent} from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-datos-fiscales',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule, // Importa MatSelectModule para los selectores
    MatButtonModule, // Opcional: Importa MatButtonModule si usas botones
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './datos-fiscales.component.html',
  styleUrl: './datos-fiscales.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar esta línea
})
export class DatosFiscalesComponent implements OnInit {
  @Input() tokens: any[] = []; // Recibe los tokens desde el componente padre
  @Output() accordionStateChange = new EventEmitter<boolean>(); // Emite true si se abre, false si se cierra

  form: FormGroup;
  correos: string[] = []; // Lista de correos electrónicos
  correoInput = new FormControl('', [Validators.email]); // Valida que sea un correo electrónico válido
  separadores: number[] = [ENTER, COMMA]; // Teclas para separar correos (Enter y Coma)
  activeTab: string = 'DATOS GENERALES'; // Por defecto, la pestaña activa es "DATOS GENERALES"

  // Opciones para los selectores
  regimenes: string[] = [
    '601 - General de Ley Personas Morales',
    '603 - Personas Morales con Fines no Lucrativos',
    '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
    '606 - Arrendamiento',
    '607 - Régimen de Enajenación o Adquisición de Bienes',
    '608 - Demás ingresos',
    '610 - Residentes en el Extranjero sin Establecimiento Permanente en México',
    '611 - Ingresos por Dividendos (socios y accionistas)',
    '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    '614 - Ingresos por intereses',
    '615 - Régimen de los ingresos por obtención de premios',
    '616 - Sin obligaciones fiscales',
    '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    '621 - Incorporación Fiscal',
    '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    '623 - Opcional para Grupos de Sociedades',
    '624 - Coordinados',
    '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    '626 - Régimen Simplificado de Confianza'
  ];
  
  regimenUsoCfdiMap: { [claveRegimen: string]: string[] } = {
    '601': ['G01 - Adquisición de mercancías', 'G03 - Gastos en general', 'I01 - Construcciones'],
    '603': ['D01 - Honorarios médicos', 'D02 - Gastos funerarios', 'D03 - Donativos'],
    '605': ['P01 - Por definir', 'S01 - Sin efectos fiscales'],
    '606': ['G01 - Adquisición de mercancías', 'G03 - Gastos en general'],
    '607': ['I01 - Construcciones', 'I02 - Mobiliario y equipo de oficina'],
    '608': ['D01 - Honorarios médicos', 'D02 - Gastos funerarios'],
  };

  estadosConCiudades: { [estado: string]: string[] } = {
    'Aguascalientes': ['Aguascalientes', 'Jesús María', 'Calvillo'],
    'Baja California': ['Mexicali', 'Tijuana', 'Ensenada'],
    'Baja California Sur': ['La Paz', 'Cabo San Lucas', 'Loreto'],
    'Campeche': ['Campeche', 'Ciudad del Carmen'],
    'Chiapas': ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas'],
    'Chihuahua': ['Chihuahua', 'Ciudad Juárez'],
    'Ciudad de México': ['Álvaro Obregón', 'Coyoacán', 'Iztapalapa'],
    'Coahuila': ['Saltillo', 'Torreón'],
    'Colima': ['Colima', 'Manzanillo'],
    'Durango': ['Durango', 'Gómez Palacio'],
    'Estado de México': ['Toluca', 'Ecatepec', 'Naucalpan'],
    'Guanajuato': ['León', 'Irapuato', 'Celaya'],
    'Guerrero': ['Chilpancingo', 'Acapulco'],
    'Hidalgo': ['Pachuca', 'Tulancingo'],
    'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
    'Michoacán': ['Morelia', 'Uruapan'],
    'Morelos': ['Cuernavaca', 'Jiutepec'],
    'Nayarit': ['Tepic', 'Bahía de Banderas'],
    'Nuevo León': ['Monterrey', 'San Nicolás de los Garza'],
    'Oaxaca': ['Oaxaca de Juárez', 'Salina Cruz'],
    'Puebla': ['Puebla', 'Tehuacán'],
    'Querétaro': ['Querétaro'],
    'Quintana Roo': ['Cancún', 'Playa del Carmen'],
    'San Luis Potosí': ['San Luis Potosí'],
    'Sinaloa': ['Culiacán', 'Mazatlán'],
    'Sonora': ['Hermosillo', 'Ciudad Obregón'],
    'Tabasco': ['Villahermosa'],
    'Tamaulipas': ['Tampico', 'Reynosa'],
    'Tlaxcala': ['Tlaxcala'],
    'Veracruz': ['Xalapa', 'Veracruz', 'Coatzacoalcos'],
    'Yucatán': ['Mérida', 'Valladolid'],
    'Zacatecas': ['Zacatecas', 'Fresnillo']
  };
  
  
  usosCfdiFiltrados: string[] = [];
  formasPago: string[] = ['01 - Efectivo', '02 - Cheque nominativo', '03 - Transferencia electrónica'];

  estados: string[] = Object.keys(this.estadosConCiudades);
  ciudades: string[] = [];


  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      rfc: ['', [Validators.required, Validators.pattern('^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$')]], // RFC con formato válido
      nombre: ['', [Validators.required, Validators.minLength(3)]], // Nombre con mínimo 3 caracteres
      regimen: ['', Validators.required], // Régimen obligatorio
      usoCfdi: ['', Validators.required], // Uso CFDI obligatorio
      cp: ['', [Validators.required, Validators.pattern('^\\d{5}$')]], // Código Postal de 5 dígitos
      estado: ['', Validators.required], // Estado obligatorio
      ciudad: ['', Validators.required], // Ciudad obligatoria
      colonia: ['', [Validators.required, Validators.minLength(3)]], // Colonia con mínimo 3 caracteres
      calle: ['', [Validators.required, Validators.minLength(3)]], // Calle con mínimo 3 caracteres
      numExt: ['', [Validators.required, Validators.pattern('^\\d+$')]], // Número exterior solo números
      numInt: ['', [Validators.pattern('^\\d*$')]], // Número interior opcional, solo números
      formaPago: ['', Validators.required], // Forma de pago obligatoria
      correos: [[], Validators.required] // Al menos un correo electrónico
    });
  }

  ngOnInit(): void {
    this.openConfirmDialog(); // Abre el diálogo al cargar el componente

    // Escuchar cambios en el campo "Régimen"
    this.form.get('regimen')?.valueChanges.subscribe((claveRegimen: string) => {
      this.onRegimenChange(claveRegimen);
    });

    this.form.get('estado')?.valueChanges.subscribe(() => {
      this.onEstadoChange();
    });
  }

  onRegimenChange(claveRegimen: string): void {
    //console.log('Régimen seleccionado:', claveRegimen); // Verifica el valor del régimen

    // Filtrar las opciones de Uso del CFDI según el régimen seleccionado
    this.usosCfdiFiltrados = this.regimenUsoCfdiMap[claveRegimen] || [];
    
    // Imprimir las opciones filtradas en la consola
    //console.log('Opciones filtradas para el régimen:', claveRegimen, this.usosCfdiFiltrados);

    // Reiniciar el valor del campo "Uso del CFDI" para obligar al usuario a seleccionar una nueva opción
    this.form.get('usoCfdi')?.setValue('');
  }

  onEstadoChange(): void {
    const estadoSeleccionado = this.form.get('estado')?.value;
    this.ciudades = this.estadosConCiudades[estadoSeleccionado] || [];
    this.form.get('ciudad')?.reset(); // Limpia la ciudad seleccionada si cambia el estado
  }
  
  onTabChange(event: any): void {
    this.activeTab = event.tab.textLabel; // Actualiza la pestaña activa según el texto de la pestaña
    console.log('Pestaña activa:', this.activeTab); // Para depuración
  }

  // Expone si el formulario es válido
  isValid(): boolean {
    this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores

    if (this.activeTab === 'DATOS GENERALES') {
      // Validar los campos de DATOS GENERALES (excepto "Número Interior") y al menos un correo
      const correosValidos = this.correos.length > 0; // Verifica que haya al menos un correo
      if (!correosValidos) {
        this.correoInput.setErrors({ required: true }); // Marca el campo de correos como inválido
        this.correoInput.markAsTouched(); // Marca el campo como tocado
      }

      return (
        (this.form.get('rfc')?.valid ?? false) &&
        (this.form.get('nombre')?.valid ?? false) &&
        (this.form.get('regimen')?.valid ?? false) &&
        (this.form.get('usoCfdi')?.valid ?? false) &&
        (this.form.get('cp')?.valid ?? false) &&
        (this.form.get('estado')?.valid ?? false) &&
        (this.form.get('ciudad')?.valid ?? false) &&
        (this.form.get('colonia')?.valid ?? false) &&
        (this.form.get('calle')?.valid ?? false) &&
        (this.form.get('numExt')?.valid ?? false) &&
        correosValidos // Verifica que haya al menos un correo
      );
    } else if (this.activeTab === 'COMPLEMENTO INE') {
      // Validar los campos de COMPLEMENTO INE
      return this.form.get('fechaComplemento')?.valid ?? false;
    }

    return false; // Si no se reconoce la pestaña activa, retorna falso
  }

  // Expone los datos del formulario
  getData(): any {
    if (this.activeTab === 'DATOS GENERALES') {
      return {
        rfc: this.form.get('rfc')?.value,
        nombre: this.form.get('nombre')?.value,
        regimen: this.form.get('regimen')?.value,
        usoCfdi: this.form.get('usoCfdi')?.value,
        cp: this.form.get('cp')?.value,
        estado: this.form.get('estado')?.value,
        ciudad: this.form.get('ciudad')?.value,
        colonia: this.form.get('colonia')?.value,
        calle: this.form.get('calle')?.value,
        numExt: this.form.get('numExt')?.value,
        numInt: this.form.get('numInt')?.value, // Opcional
        correos: this.correos // Incluye los correos electrónicos
      };
    } else if (this.activeTab === 'COMPLEMENTO INE') {
      return {
        fechaComplemento: this.form.get('fechaComplemento')?.value
      };
    }
  
    return null; // Si no se reconoce la pestaña activa, retorna null
  }

  onAccordionOpened(): void {
    this.accordionStateChange.emit(true); // Notifica que el acordeón se abrió
  }

  onAccordionClosed(): void {
    this.accordionStateChange.emit(false); // Notifica que el acordeón se cerró
  }

  agregarCorreo(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    const value = event.value.trim();

    // Expresión regular para validar correos electrónicos
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Verificar si ya hay 3 correos
    if (this.correos.length >= 3) {
      return; // No agregar más correos si ya hay 3
    }

    // Validar el formato del correo y agregarlo si es válido
    if (value && emailRegex.test(value)) {
      this.correos.push(value);
      this.correoInput.reset(); // Limpia el input
    } else if (value) {
      // Mostrar un mensaje de error si el correo no es válido
      this.correoInput.setErrors({ invalidEmail: true });
      this.correoInput.markAsTouched(); // Marca el campo como tocado para mostrar el error
    }

    // Limpia el campo de entrada
    if (input) {
      input.value = '';
    }
  }

  eliminarCorreo(correo: string): void {
    const index = this.correos.indexOf(correo);

    if (index >= 0) {
      this.correos.splice(index, 1);
    }
  }

  readonly reactiveKeywords = signal(['']);
  readonly formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);

  removeReactiveKeyword(keyword: string) {
    this.reactiveKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.reactiveKeywords.update(keywords => [...keywords, value]);
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `
          <strong>Recuerde:</strong><br>
          La información ingresada debe de ser la que contiene la constancia de situación fiscal:<br>
          - RFC de cliente<br>
          - Nombre, denominación o razón social<br>
          - Régimen fiscal<br>
          - Código postal
        `,
        confirmText: 'Estoy de acuerdo',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log('El usuario confirmó la acción.');
      } else {
        //console.log('El usuario canceló la acción.');
      }
    });
  }
}
