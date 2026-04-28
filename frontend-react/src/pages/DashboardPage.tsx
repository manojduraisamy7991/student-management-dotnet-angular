import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { deleteStudent, getStudents } from '../services/studentService'
import type { Student } from '../types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { showNotification } = useNotification()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const data = await getStudents()
        if (active) setStudents(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load students'
        if (message.toLowerCase().includes('401')) {
          logout()
          showNotification('Session expired. Please login again.', 'error')
          navigate('/login')
          return
        }
        if (active) setError(message)
        if (active) showNotification(message, 'error')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [logout, navigate, showNotification])

  async function confirmDelete() {
    if (!studentToDelete) return
    setIsLoading(true)
    setError('')
    try {
      await deleteStudent(studentToDelete.id)
      const data = await getStudents()
      setStudents(data)
      showNotification('Student deleted successfully')
      setStudentToDelete(null)
      setIsLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete student'
      setError(message)
      showNotification(message, 'error')
      setIsLoading(false)
    }
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">Manage your student roster and details</p>
        </div>
        <Link
          to="/student/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-lg font-semibold text-white hover:bg-blue-700 sm:w-auto"
        >
          Add Student
        </Link>
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? <p className="p-6 text-slate-500">Loading students...</p> : null}
        {!isLoading && students.length === 0 ? <p className="p-6 text-slate-500">No students found.</p> : null}
        {!isLoading && students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Enrolled</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-sm text-slate-800">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">{student.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">{student.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">{student.course}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/student/edit/${student.id}`}
                          className="rounded-lg border border-blue-300 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                          onClick={() => setStudentToDelete(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <ConfirmModal
        isOpen={studentToDelete !== null}
        title="Delete Student"
        message={
          studentToDelete
            ? `Are you sure you want to delete "${studentToDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </section>
  )
}
