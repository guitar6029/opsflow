import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject([
    { id: 1, title: 'Fix server issue', status: 'open' },
    { id: 2, title: 'Deploy update', status: 'in-progress' },
  ]);

  tasks$ = this.taskSubject.asObservable();
}
