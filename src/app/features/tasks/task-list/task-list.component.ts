import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';
import { Task } from '../../../core/models/task.model';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    DatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 5;
  searchQuery = '';
  completedFilter?: boolean;
  displayedColumns: string[] = ['title', 'description', 'completed', 'createdAt', 'actions'];

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Cargar tareas
   */
  loadTasks(): void {
    this.taskService.getAllTasks(
      this.currentPage,
      this.itemsPerPage,
      this.searchQuery,
      this.completedFilter
    ).subscribe(response => {
      this.tasks = response.data.tasks;
      this.totalItems = response.data.pagination.totalItems;
    });
  }

  /**
   * Cambiar de página
   * @param page
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  /**
   * Buscar tareas
   */
  onSearch(): void {
    this.currentPage = 1;
    this.loadTasks();
  }

  /**
   * Crear tarea nueva
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado con resultado:', result);
      if (result === true) {
        this.loadTasks();
      }
    });
  }

  /**
   * Editar tarea
   * @param task
   */
  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      disableClose: true,
      data: task // Pasar la tarea completa
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado con resultado:', result);
      if (result === true) {
        this.loadTasks();
      }
    });
  }

  /**
   * Estado de la tarea
   * @param task
   */
  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task.id!, { completed: !task.completed }).subscribe(() => {
      this.loadTasks();
    });
  }

  /**
   * Eliminar tarea
   * @param id
   */
  deleteTask(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  /**
   * Limpiar filtros
    */
  clearFilters(): void {
    this.searchQuery = '';
    this.completedFilter = undefined;
    this.currentPage = 1;
    this.loadTasks();
  }
}
