import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, ToastController
} from '@ionic/angular';
import { OrderService } from '../services/order.service';
import { Order, OrderItem } from '../models/order-model';

import { ToastService } from '../services/toast.service';

// Deklarace pro TypeScript, aby znal nativní Web Speech API prohlížeče
declare var window: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea
  ],
})
export class Tab1Page {
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);

  isRecording: boolean = false;
  
  // Finální text objednávky
  transcript: string = '';
  
  // Pomocná proměnná pro průběžně rozpoznávaná slova
  interimTranscript: string = ''; 
  
  // Instance rozpoznávání hlasu
  private recognition: any;

  constructor() {
    this.initSpeechRecognition();
  }

  // Nastavení rozpoznávání hlasu
  private initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'cs-CZ'; // Nastavení češtiny
      this.recognition.continuous = true; // Bude nahrávat, dokud to uživatel nevypne
      this.recognition.interimResults = true; // Zapne vracení průběžných výsledků (slovo od slova)

      this.recognition.onstart = () => {
        this.isRecording = true;
      };

      this.recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        // Procházení výsledků a jejich skládání
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        // Pokud je věta ukončená, přidáme ji do hlavního pole
        if (currentFinal) {
          this.transcript += currentFinal + ' ';
        }
        
        // Průběžná slova (než se potvrdí věta) zobrazujeme živě
        this.interimTranscript = currentInterim;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Chyba mikrofonu:', event.error);
        if (event.error === 'not-allowed') {
          this.toastService.showToast('Přístup k mikrofonu byl odepřen.', 'danger');
        }
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.interimTranscript = ''; // Vyčištění průběžného textu po vypnutí
      };
    } else {
      console.warn('Tento prohlížeč nepodporuje Web Speech API.');
    }
  }

  toggleRecording() {
    if (!this.recognition) {
      this.toastService.showToast('Váš prohlížeč nepodporuje rozpoznávání hlasu. Zkuste Chrome, Safari nebo Edge.', 'danger');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      // Vymažeme starý text a spustíme záznam (samo to vyvolá dotaz na oprávnění)
      this.transcript = ''; 
      this.interimTranscript = '';
      this.recognition.start();
    }
  }

  async processOrder() {
    if (!this.transcript) return;

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }

    // ZDE POZDĚJI IMPLEMENTUJEME VOLÁNÍ GEMINI PRO API
    const mockExtractedItems: OrderItem[] = [
      { name: 'Káva Zrno', count: 1, unit: 'kg' } // Dočasná mock data
    ];

    const newOrder: Order = {
      id: crypto.randomUUID(),
      customerName: 'Neznámý zákazník (Z chatu)',
      items: mockExtractedItems,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await this.orderService.addOrder(newOrder);
    this.transcript = '';
    this.toastService.showToast('Objednávka uložena a odeslána AI.', 'success');
  }

}