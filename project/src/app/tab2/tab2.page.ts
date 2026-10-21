import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  AlertController,
  ToastController,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  searchQuery = signal('');
  sortOption = signal<'newest' | 'name' | 'value'>('newest');

  readonly totalSum = computed(() => {
    return this.counterService.counters().reduce((sum, counter) => sum + counter.value, 0);
  });

  readonly averageValue = computed(() => {
    const counters = this.counterService.counters();
    if (counters.length === 0) return 0;
    return this.totalSum() / counters.length;
  });

  readonly displayedCounters = computed(() => {
    let list = this.counterService.counters();
    const query = this.searchQuery().trim().toLowerCase();

    if (query) {
      list = list.filter(c => c.name.toLowerCase().includes(query));
    }

    const sortType = this.sortOption();
    return [...list].sort((a, b) => {
      if (sortType === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortType === 'value') {
        return b.value - a.value;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.showToast('Záznam byl úspěšně odstraněn.', 'danger');
  }

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Opravdu vymazat?',
      message: 'Tato akce trvale odstraní celou historii počítadel.',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        { text: 'Vymazat', role: 'destructive', handler: () => this.clear() },
      ],
    });
    await alert.present();
  }

  private async clear(): Promise<void> {
    await this.counterService.clear();
    await this.showToast('Historie byla kompletně vymazána.', 'medium');
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}