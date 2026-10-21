import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastController } from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterServiceMock: Partial<CounterService>;
  let toastControllerMock: any;

  beforeEach(() => {
    counterServiceMock = {
      add: vi.fn().mockResolvedValue(undefined),
    };

    toastControllerMock = {
      create: vi.fn().mockResolvedValue({
        present: vi.fn().mockResolvedValue(undefined),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CounterService, useValue: counterServiceMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should forward saved counter to the service and show toast', async () => {
    const counter: SavedCounter = {
      id: 'test-id',
      name: 'Test',
      value: 1,
      createdAt: '2026-10-11T12:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(counter);
    expect(toastControllerMock.create).toHaveBeenCalled();
  });
});