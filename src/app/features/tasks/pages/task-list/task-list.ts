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

  showTaskForm = false;
  availableStatuses = ['open', 'in_progress', 'closed'];

  toggleFormView() {
    this.showTaskForm = !this.showTaskForm;
  }

  addTaskHandler(event: Event) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const status = formData.get('status') as string;
    this.taskService.addTask({ title, status });

    //clea form
    form.reset();
  }
}
