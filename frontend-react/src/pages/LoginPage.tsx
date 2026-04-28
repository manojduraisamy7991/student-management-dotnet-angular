import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { login } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuthenticatedUser } = useAuth()
  const { showNotification } = useNotification()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login({ email, password })
      setAuthenticatedUser(user)
      showNotification('Login successful')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      showNotification(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex justify-center px-2 py-2 sm:px-4 sm:py-6">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage your students</p>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
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
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </label>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Do not have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  )
}
