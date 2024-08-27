import { Injectable, EventEmitter } from '@angular/core';
import { CustomTexts } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ImplerService {
  private isImplerReady = false;
  public widgetEvents = new EventEmitter<any>();

  public initializeImpler(): void {
    const uuid = this.generateUuid();
    if (window.impler) {
      window.impler.init(uuid);
      const intervalId = setInterval(() => {
        if (window.impler.isReady()) {
          this.isImplerReady = true;
          clearInterval(intervalId);
        }
      }, 1000);

      window.impler.on(
        'message',
        (eventData) => {
          this.widgetEvents.emit(eventData);
        },
        uuid
      );
    }
  }

  public show(options: { projectId: string; templateId: string; accessToken: string; texts?: CustomTexts }): void {
    if (this.isImplerReady) {
      window.impler.show(options);
    } else {
      console.error('Impler is not ready yet.');
    }
  }

  public getReadyState(): boolean {
    return this.isImplerReady;
  }

  private generateUuid(): string {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
  }
}
