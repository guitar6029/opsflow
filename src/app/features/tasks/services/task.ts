import { Injectable } from '@angular/core';
import { BehaviorSubject, map, delay, of, take } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject([
    { id: 1, title: 'Fix server issue', status: 'open' },
    { id: 2, title: 'Deploy update', status: 'in-progress' },
  ]);

  private id = 3;

  tasks$ = this.taskSubject.asObservable();

  addTask(task: { title: string; status: string }) {
    //should generate id automatically
    const currentTasks = this.taskSubject.getValue();

    this.taskSubject.next([...currentTasks, { ...task, id: this.id }]);
    this.id++;
  }

  searchTasks(query: string) {
    return this.tasks$.pipe(
      take(1),
      delay(500),
      map((tasks) =>
        tasks.filter((task) => task.title.toLocaleLowerCase().includes(query.toLowerCase())),
      ),
    );
  }
}
