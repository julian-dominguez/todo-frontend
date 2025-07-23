import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

// Material imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Task
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });

    // Solo aplicar valores si hay datos (edición)
    if (this.data) {
      this.isEdit = true;
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description || '',
        completed: this.data.completed
      });
    }
  }

  /**
   * Enviar formulario
   */
  onSubmit(): void {
    if (this.taskForm.invalid) {
      // Se marcan todos los campos como tocados para mostrar errores
      this.markFormGroupTouched();
      return;
    }

    const taskData: Task = this.taskForm.value;

    if (this.isEdit && this.data?.id) {
      this.taskService.updateTask(this.data.id, taskData).subscribe({
        next: (response) => {
          console.log('Tarea actualizada:', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error actualizando tarea:', error);
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          console.log('Tarea creada:', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creando tarea:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }
}
