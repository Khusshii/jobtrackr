import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: 'Board' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/discover', label: 'Discover' }
  ]

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">J</div>
            <span className="text-lg font-bold text-white">JobTrackr</span>
          </Link>
          <nav className="flex gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-slate-300">{user?.name?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
