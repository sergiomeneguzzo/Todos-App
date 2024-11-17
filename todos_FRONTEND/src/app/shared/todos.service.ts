import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Todo } from '../interfaces/todo.entity';
import { AuthService, User } from './auth.service';
import { APIURL } from '../enviroments/apiurl';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  protected _users$ = new BehaviorSubject<User[]>([]);
  users$ = this._users$.asObservable();

  protected _todos$ = new BehaviorSubject<Todo[]>([]);
  todos$ = this._todos$.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  list(includeCompleted: boolean): Observable<Todo[]> {
    const url = `${APIURL}/api/todo?completed=${includeCompleted}`;
    return this.http
      .get<Todo[]>(url)
      .pipe(tap((todos) => this._todos$.next(todos)));
  }

  add(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${APIURL}/api/todo`, todo).pipe(
      tap(() => {
        this.list(false).subscribe();
      })
    );
  }

  checkTodo(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${APIURL}/api/todo/${id}/check`, {});
  }

  uncheckTodo(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${APIURL}/api/todo/${id}/uncheck`, {});
  }

  delete(todoId: string): Observable<Todo> {
    const url = `${APIURL}/api/todo/${todoId}`;
    return this.http.delete<Todo>(url);
  }

  assign(todoId: string, assignedTo: string): Observable<any> {
    const url = `${APIURL}/api/todo/${todoId}/assign`;
    return this.http.patch(url, { assignedTo });
  }

  getUsers() {
    this.http.get<User[]>(`${APIURL}/api/users/users`).subscribe((user) => {
      this._users$.next(user);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.authService.currentUser$;
  }
}
