import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { combineLatest, map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, ReactiveFormsModule],
  standalone: true,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskService = inject(TaskService);
  tasks$ = this.taskService.tasks$;
  filterControl = new FormControl('all', { nonNullable: true });
  searchControl = new FormControl('', { nonNullable: true });
  search$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => this.taskService.searchTasks(query)),
  );

  filteredTasks$ = combineLatest([
    this.filterControl.valueChanges.pipe(startWith(this.filterControl.value)),
    this.search$,
  ]).pipe(
    map(([filter, tasks]) => {
      if (filter === 'all') return tasks;
      return tasks.filter((task) => task.status === filter);
    }),
  );

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

  handleClearSearch() {
    this.searchControl.setValue('');
  }
}
