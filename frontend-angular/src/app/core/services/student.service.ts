import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/students`);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${environment.apiUrl}/students/${id}`);
  }

  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(`${environment.apiUrl}/students`, student);
  }

  updateStudent(id: number, updates: Omit<Student, 'id'>): Observable<Student> {
    return this.http.put<Student>(`${environment.apiUrl}/students/${id}`, updates);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/students/${id}`);
  }
}
