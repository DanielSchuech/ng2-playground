import {Injectable, EventEmitter, Inject} from '@angular/core';

@Injectable()
export class EventService {
  public event: EventEmitter<string>;
  constructor() {
    this.event = new EventEmitter();
    
    let i = 0;
    setInterval(() => {
      if (i) {
        this.event.emit('hello');
        i = 0;
      } else {
        this.event.emit('world');
        i = 1;
      }
    }, 2000);
  }
}
