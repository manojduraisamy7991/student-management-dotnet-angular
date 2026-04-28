import { apiRequest } from '../lib/api'
import type { Student } from '../types'

interface DotNetValues<T> {
  $values: T[]
}

function normalizeStudents(data: Student[] | DotNetValues<Student>): Student[] {
  return Array.isArray(data) ? data : data.$values ?? []
}

export async function getStudents(): Promise<Student[]> {
  const data = await apiRequest<Student[] | DotNetValues<Student>>('/students')
  return normalizeStudents(data)
}

export function getStudent(id: number): Promise<Student> {
  return apiRequest<Student>(`/students/${id}`)
}

export function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
  return apiRequest<Student>('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  })
}

export function updateStudent(id: number, updates: Omit<Student, 'id'>): Promise<Student> {
  return apiRequest<Student>(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export function deleteStudent(id: number): Promise<void> {
  return apiRequest<void>(`/students/${id}`, {
    method: 'DELETE',
  })
}
