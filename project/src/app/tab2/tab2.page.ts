import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonTitle, IonToolbar, AlertController, ToastController, 
  IonSearchbar, IonSelect, IonSelectOption, IonBadge, IonText
} from '@ionic/angular';
import { OrderService } from '../services/order.service';
import { IonSpinner } from '@ionic/angular';
import { IonNote } from '@ionic/angular';

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonNote, IonSpinner, 
    DatePipe, FormsModule, IonButton, IonContent, IonHeader,
    IonItem, IonLabel, IonList, IonTitle, IonToolbar, 
    IonSearchbar, IonSelect, IonSelectOption, IonBadge, IonText
  ],
})
export class Tab2Page {
  readonly orderService = inject(OrderService);
  private alertController = inject(AlertController);
  private readonly toastService = inject(ToastService);

  searchQuery = signal('');
  sortOption = signal<'newest' | 'name'>('newest');

  // Vypočítaný signál pro filtrování a řazení
  readonly displayedOrders = computed(() => {
    let list = this.orderService.orders();
    const query = this.searchQuery().trim().toLowerCase();

    // Hledání podle jména zákazníka nebo názvu produktu
    if (query) {
      list = list.filter(o => 
        o.customerName.toLowerCase().includes(query) || 
        o.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    const sortType = this.sortOption();
    return [...list].sort((a, b) => {
      if (sortType === 'name') {
        return a.customerName.localeCompare(b.customerName);
      }
      // Výchozí: od nejnovějšího
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Opravdu vymazat?',
      message: 'Tato akce trvale odstraní celou historii objednávek.',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        { text: 'Vymazat', role: 'destructive', handler: () => this.clear() },
      ],
    });
    await alert.present();
  }

  private async clear(): Promise<void> {
    await this.orderService.clearHistory();
    await this.toastService.showToast('Historie objednávek byla vymazána.', 'danger');
  }

}