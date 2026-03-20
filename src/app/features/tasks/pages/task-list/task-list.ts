import { Component } from '@angular/core';
import { TaskService } from '../../services/task';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  tasks$;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }
}
