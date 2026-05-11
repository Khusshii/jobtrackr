import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-base font-semibold text-blue-600">
            JobTrackr
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`text-sm ${location.pathname === '/' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Board
            </Link>
            <Link
              to="/analytics"
              className={`text-sm ${location.pathname === '/analytics' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Hi, {user?.name?.split(' ')[0]}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
