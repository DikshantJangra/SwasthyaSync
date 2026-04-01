import { EventEmitter } from 'events';

export interface DomainEvent {
  name: string;
  payload: any;
  timestamp: Date;
}

export class EventBus {
  private emitter = new EventEmitter();

  publish(event: DomainEvent) {
    this.emitter.emit(event.name, event);
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => void) {
    this.emitter.on(eventName, handler);
  }
}

// Singleton for app-wide events
export const eventBus = new EventBus();
