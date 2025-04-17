import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  activeIndex: number = -1;
  
  faqs: FaqItem[] = [
    {
      question: '¿Dónde puedo elaborar mi factura?',
      answer: 'Puede elaborar su factura en nuestro portal de Facturación <a href="http://www.facturaelectronicagfa.mx" target="_blank">www.facturaelectronicagfa.mx</a> donde es rápido y sencillo. Si su boleto no cuenta con token (boleto manual o de tijera) puede mandar una imagen de los boletos al siguiente correo <a href="mailto:cfdiboletoprimeraplus@flecha-amarilla.com">cfdiboletoprimeraplus@flecha-amarilla.com</a> y sus datos fiscales completos.'
    },
    {
      question: '¿Qué necesito para poder elaborar mi factura?',
      answer: `<ul>
        <li>Correo electrónico a donde se enviará la factura digital.</li>
        <li>Boletos del servicio recibido.</li>
        <li>Datos fiscales completos a la cual se realizará la factura:
          <ul>
            <li>Razón social</li>
            <li>RFC</li>
            <li>Dirección completa</li>
            <li>C.P.</li>
          </ul>
        </li>
      </ul>`
    },
    {
      question: '¿Puedo elaborar una factura de varios boletos?',
      answer: 'Sí, en nuestro portal de facturación <a href="http://www.facturaelectronicagfa.mx" target="_blank">www.facturaelectronicagfa.mx</a>, le permite ingresar como máximo 19 boletos (token) por factura.'
    },
    {
      question: '¿Qué es un token?',
      answer: 'Es un código identificador que tiene su boleto para realizar su facturación.'
    },
    {
      question: '¿Cuál es el plazo para poder elaborar mi factura?',
      answer: 'Deberá elaborar su factura dentro del mes de compra.'
    },
    {
      question: '¿Cómo puedo recuperar mi factura, si no me llegó a mi correo?',
      answer: `Siga los siguientes pasos:
      <ol>
        <li><strong>Paso 1:</strong> Ingresar al link (<a href="http://www.facturaelectronicagfa.mx" target="_blank">www.facturaelectronicagfa.mx</a>) al campo: Recuperar CFDI.</li>
        <li><strong>Paso 2:</strong> Seleccionar una empresa. Boleto de autobús.</li>
        <li><strong>Paso 3:</strong> Llenar los campos solicitados:
          <ul>
            <li>RFC</li>
            <li>Token (alguno de los token que desee recuperar).</li>
          </ul>
        </li>
        <li><strong>Paso 4:</strong> Dar clic en el botón Buscar Factura.</li>
        <li><strong>Paso 5:</strong> Dar clic en el botón descargar la factura.</li>
      </ol>
      <p><strong>Nota:</strong> Deberá de tener a la mano sus boletos y su RFC al que realizó la factura.</p>`
    },
    {
      question: '¿Cómo y dónde puedo verificar el número de token, cuando en el boleto no es visible o se encuentra incompleto?',
      answer: `Envíe un correo electrónico a <a href="mailto:cfdiboletoprimeraplus@flecha-amarilla.com">cfdiboletoprimeraplus@flecha-amarilla.com</a>, deberá enviar la siguiente información:
      <ul>
        <li>Origen</li>
        <li>Destino</li>
        <li>Fecha</li>
        <li>Horario</li>
        <li>Nombre pasajero</li>
        <li>Asiento</li>
        <li>Número de servicio</li>
      </ul>`
    },
    {
      question: '¿Si tiene algún error mi Factura, puedo corregirlo?',
      answer: `Sí, solo si el error es en el RFC (error en escritura Ejemplo: (poner la letra ele en lugar de i mayúscula o cero en lugar de la letra O); deberá enviar sus datos fiscales completos, así como el folio y número de factura al correo electrónico <a href="mailto:cfdiboletoprimeraplus@flecha-amarilla.com">cfdiboletoprimeraplus@flecha-amarilla.com</a>
      <p><strong>IMPORTANTE:</strong> No hay correcciones de razón social a otra razón social diferente en facturas elaboradas.</p>`
    }
  ];

  toggleFaq(index: number): void {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }
}