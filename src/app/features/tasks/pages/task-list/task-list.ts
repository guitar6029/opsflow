import { Component } from '@angular/core';
import { TaskService } from '../../services/task';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, ReactiveFormsModule],
  standalone: true,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  tasks$;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    status: new FormControl('open', Validators.required),
  });

  showTaskForm = false;
  availableStatuses = ['open', 'in_progress', 'closed'];

  ngOnInit() {
    this.form.valueChanges.subscribe((value) => {
      console.log('form changed : ', value);
    });
  }

  toggleFormView() {
    this.showTaskForm = !this.showTaskForm;
  }

  //controlled
  addTask() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (!value.title || !value.status) return;

    this.taskService.addTask({
      title: value.title,
      status: value.status,
    });

    this.form.reset({ status: 'open' });
  }

  // uncontrolled
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
