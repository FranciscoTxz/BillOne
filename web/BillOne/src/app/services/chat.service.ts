import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
}

export interface ChatResponse {
  id: string;
  choices: {
    message: ChatMessage;
    index: number;
    finish_reason: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.deepseekApiUrl;
  private apiKey = environment.deepseekApiKey;
  

  constructor(private http: HttpClient) {
    this.apiKey = "sk-4adc1f91f9e241d995c65009c593d5df";
  }

  sendMessage(messages: ChatMessage[]): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body: ChatRequest = {
      model: 'deepseek-chat',
      messages: messages,
      temperature: 1.3,
      max_tokens: 350
    };

    return this.http.post<ChatResponse>(this.apiUrl, body, { headers });
  }
}