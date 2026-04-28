import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  function onLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-wide sm:text-3xl">
          EduManage
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-2 py-1 text-sm font-semibold text-white/90 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-2xl"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="rounded-xl border border-white/50 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 sm:px-4 sm:text-base"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-2 py-1 text-sm font-semibold text-white/90 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-base"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 sm:px-4 sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
