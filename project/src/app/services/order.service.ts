// src/app/services/order.service.ts
import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Order } from '../models/order-model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Klíč pro lokální uložení
  private readonly STORAGE_KEY = 'coffee_orders_history';

  // Signal držící aktuální seznam objednávek (reaktivní)
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.loadOrdersLocally();
  }

  // 1. Vytvoření a uložení nové objednávky
  async addOrder(newOrder: Order): Promise<void> {
    // Přidáme objednávku na začátek pole
    const updatedOrders = [newOrder, ...this.orders()];
    this.orders.set(updatedOrders);
    
    // Uložíme do Capacitor Preferences (lokálně na mobil/do prohlížeče)
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(updatedOrders)
    });

    // ZDE POZDĚJI: this.http.post('moje-api.cz/orders', newOrder).subscribe(...)
  }

  // 2. Načtení historie po zapnutí aplikace
  private async loadOrdersLocally(): Promise<void> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    if (value) {
      this.orders.set(JSON.parse(value));
    }
  }

  // 3. Pomocná funkce pro smazání historie (pro vývoj)
  async clearHistory(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
    this.orders.set([]);
  }
}