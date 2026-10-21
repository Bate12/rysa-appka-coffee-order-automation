import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root' // 'root' znamená, že služba je globální pro celou aplikaci
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  /**
   * Zobrazí globální Toast notifikaci.
   * @param message Text zprávy
   * @param color Barva (např. 'success', 'danger', 'warning', 'medium')
   * @param position Pozice ('top', 'middle', 'bottom') - výchozí je 'top'
   */
  async showToast(
    message: string, 
    color: 'success' | 'danger' | 'warning' | 'medium' | 'primary' | 'dark' = 'medium',
    position: 'top' | 'middle' | 'bottom' = 'top'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position,
    });
    await toast.present();
  }
}