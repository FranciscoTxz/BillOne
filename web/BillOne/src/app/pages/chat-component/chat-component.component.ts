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
    content: 'Eres un asistente de facturación para la aplicación BillOne. Ayuda a los usuarios con su proceso de facturación en México, guiándolos sobre cómo ingresar datos del servicio, datos fiscales y completar su factura. Si te preguntan algo que no relacionado a datos personales, el proceso de facturacion o datos para la facturacion de la compañia entonces di que no estas entrenado para esos temas. Recuerda que tu respuesta se mostrará en un chat, por lo tanto no retornes el texto con markdown language etc, solo texto plano. Estructura tu respuesta sabiendo que se mostrará en un chat.'
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
