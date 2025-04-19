import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatMessage, ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './chat-component.component.html',
  styleUrl: './chat-component.component.scss'
})
export class ChatComponent {
  @Output() close = new EventEmitter<void>();
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;
  
  // Initial system message to set context for the AI
  private systemMessage: ChatMessage = {
    role: 'system',
    content: `Eres un asistente de facturación para la aplicación BillOne la cual ofrece tres servicios: Boletos de autobus, boletos de envíos y consumo de alimentos. 
    Ayuda a los usuarios con su proceso de facturación en México, guiándolos sobre cómo ingresar datos del servicio, 
    datos fiscales y completar su factura. Si te preguntan algo que no relacionado a datos personales, el proceso de facturacion 
    o datos para la facturacion de la compañia entonces di que no estas entrenado para esos temas. Recuerda que tu respuesta se mostrará en un chat,
     por lo tanto no retornes el texto con markdown language etc, solo texto plano, no uses caracteres que hagan dificil de 
     comprender tu texto si no se interpreta como las negritas o asteriscos, en vez de eso usa saltos de linea. 
     Estructura tu respuesta sabiendo que se mostrará en un chat.
     Te voy a dar info de nuestro sistema: El usuario primero ingresará el servicio que desea facturar, 
     luego ingresará su RFC y el token del boleto su autobus, envío o del autobus donde consumió alimentos, 
     puede agregar varios tokens ya que pues puede querer facturar varios boletos (la compra de su familia, equipo etc) 
     }y debajo se irá mostrando cada servicio que va a facturar, para agregar tokens solo debe seguir ingresandolos
      y dando click en el botón de agregar token con lo cual se limpia el input de token para el siguiente.
      Luego el usuario ingresara su regimen fiscal, correo, estado, colonia, numero exterior, calle, tipo de pago (efectivo, credito, debito), uso del CFDI, codigo postal y ciudad.
      Esta info normalmente se obtiene de la constancia de situacion fiscal del usuario. Todo este proceso se hace en varias pantallas, entonces tu no sabes que ya ingreso el usuario o no.
     `
  };

  constructor(private chatService: ChatService) {
    // Add welcome message
    this.messages.push({
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de facturación. ¿Cómo puedo ayudarte hoy con tus facturas?'
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.newMessage
    };
    this.messages.push(userMessage);
    this.isLoading = true;
    
    // Create messages array for API with system message first
    const apiMessages = [this.systemMessage, ...this.messages];
    
    // Clear input field
    this.newMessage = '';
    
    // Call API
    this.chatService.sendMessage(apiMessages).subscribe({
      next: (response) => {
        if (response.choices && response.choices.length > 0) {
          const assistantMessage = response.choices[0].message;
          this.messages.push(assistantMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta nuevamente.'
        });
        this.isLoading = false;
      }
    });
  }

  closeChat(): void {
    this.close.emit();
  }
}
