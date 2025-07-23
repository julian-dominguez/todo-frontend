import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAllTasks(page: number = 1, limit: number = 5, search: string = '', completed?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    if (completed !== undefined) {
      params = params.set('completed', completed.toString());
    }

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    // Solo enviar los campos permitidos para creación
    const taskData = {
      title: task.title,
      description: task.description
    };

    return this.http.post<Task>(`${this.apiUrl}`, taskData);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    // Para actualización, podemos incluir completed si es necesario
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
