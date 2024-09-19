import { Injectable, EventEmitter } from '@angular/core';
import { EventCalls, IShowWidgetProps, logError } from '@impler/client';

@Injectable({
  providedIn: 'root',
})
export class ImplerService {
  private uuid: string;
  private isImplerReady = false;
  private widgetEvents = new EventEmitter<EventCalls>(true);

  initializeImpler(): void {
    this.uuid = this.generateUuid();
    if (window.impler) {
      window.impler.init(this.uuid);
      const intervalId = setInterval(() => {
        if (window.impler.isReady()) {
          this.isImplerReady = true;
          clearInterval(intervalId);
        }
      }, 1000);

      window.impler.on(
        'message',
        (eventData: EventCalls) => {
          this.widgetEvents.emit(eventData);
        },
        this.uuid
      );
    } else logError('IMPLER_UNDEFINED_ERROR');
  }

  showWidget(options: IShowWidgetProps): void {
    if (this.isImplerReady) {
      window.impler.show({ ...options, uuid: this.uuid });
    } else {
      logError('IMPLER_UNDEFINED_ERROR');
    }
  }

  getReadyState(): boolean {
    return this.isImplerReady;
  }

  private generateUuid(): string {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
  }
  closeWidget() {
    if (window.impler) {
      window.impler.close();
    } else logError('IMPLER_UNDEFINED_ERROR');
  }
  subscribeToWidgetEvents(callback: (data: EventCalls) => void): void {
    this.widgetEvents.subscribe(callback);
  }
}
