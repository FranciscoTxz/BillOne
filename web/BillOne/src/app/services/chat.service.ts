import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private apiKey = 'sk-32d2c0023b38472fb04afdc7a5b31614';

  constructor(private http: HttpClient) {}

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