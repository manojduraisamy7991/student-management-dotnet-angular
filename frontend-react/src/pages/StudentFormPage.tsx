import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNotification } from '../contexts/NotificationContext'
import { addStudent, getStudent, updateStudent } from '../services/studentService'

function toDateInputValue(value: string): string {
  return new Date(value).toISOString().split('T')[0]
}

export function StudentFormPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const params = useParams<{ id: string }>()
  const isEditMode = useMemo(() => Boolean(params.id), [params.id])
  const studentId = params.id ? Number(params.id) : null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState('')
  const [enrollmentDate, setEnrollmentDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode || studentId === null) return

    void getStudent(studentId)
      .then((student) => {
        setName(student.name)
        setEmail(student.email)
        setPhone(student.phone)
        setCourse(student.course)
        setEnrollmentDate(toDateInputValue(student.enrollmentDate))
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load student')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isEditMode, studentId])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    const payload = {
      name,
      email,
      phone,
      course,
      enrollmentDate: new Date(enrollmentDate).toISOString(),
    }

    try {
      if (isEditMode && studentId !== null) {
        await updateStudent(studentId, payload)
        showNotification('Student updated successfully')
      } else {
        await addStudent(payload)
        showNotification('Student added successfully')
      }
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save student'
      setError(message)
      showNotification(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="flex justify-center px-2 py-2 sm:px-4 sm:py-6">
      <form
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {isEditMode ? 'Edit Student' : 'Add Student'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isEditMode ? 'Update student information' : 'Enter new student details'}
        </p>

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading student details...</p> : null}

        {!isLoading ? (
          <>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Full Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-slate-700">
              Phone
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-slate-700">
              Course
              <input
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-slate-700">
              Enrollment Date
              <input
                type="date"
                value={enrollmentDate}
                onChange={(event) => setEnrollmentDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : isEditMode ? 'Update Student' : 'Add Student'}
              </button>
              <Link
                to="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto"
              >
                Cancel
              </Link>
            </div>
          </>
        ) : null}
      </form>
    </section>
  )
}
