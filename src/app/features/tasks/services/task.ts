import { Injectable } from '@angular/core';
import { BehaviorSubject, map, delay, throwError, take, timer, switchMap } from 'rxjs';
import { Status, STATUSES, Task } from '../../../types/task/Task';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task[]>([
    { id: 1, title: 'Fix server issue', status: 'open' },
    { id: 2, title: 'Deploy update', status: 'in_progress' },
  ]);

  private id = 3;

  tasks$ = this.taskSubject.asObservable();

  addTask(task: { title: string; status: Status }) {
    //should generate id automatically
    const currentTasks = this.taskSubject.getValue();

    this.taskSubject.next([...currentTasks, { ...task, id: this.id }]);
    this.id++;
  }

  searchTasks(query: string) {
    if (query === 'error') {
      return timer(500).pipe(switchMap(() => throwError(() => new Error('Search failed'))));
    }

    return this.tasks$.pipe(
      take(1),
      delay(500),
      map((tasks) =>
        tasks.filter((task) => task.title.toLocaleLowerCase().includes(query.toLowerCase())),
      ),
    );
  }
}
