import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Leaf, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { label: 'nav_home', path: '/' },
  { label: 'nav_crops', path: '/crops' },
]

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')
  }

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="text-green-600 w-6 h-6 animate-pulse" />
          <span className="text-xl font-bold text-primary tracking-tight">
            {t('app_name')}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path)
                  ? 'text-primary border-b-2 border-primary pb-0.5'
                  : 'text-text-secondary'
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-background"
          >
            {i18n.language === 'en' ? 'हिंदी' : 'English'}
          </button>

          {user ? (
            // Logged in — show user dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium max-w-24 truncate">{user.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                      {t(user.role)}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-secondary hover:bg-background transition-colors border-b border-border"
                    >
                    <Settings className="w-4 h-4" />
                    {t('my_profile')}
                    </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not logged in
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary hover:bg-primary-light">
                  {t('register')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-primary p-1 rounded-md hover:bg-background transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                isActive(link.path) ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {t(link.label)}
            </Link>
          ))}

          <div className="border-t border-border pt-3 flex flex-col gap-2">
            <button
              onClick={toggleLanguage}
              className="text-sm text-text-secondary hover:text-primary text-left py-1"
            >
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>

            {user ? (
              <>
                <div className="bg-primary/5 rounded-lg px-3 py-2">
                  <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                    {t(user.role)}
                  </span>
                </div>
                <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-secondary hover:bg-background transition-colors border-b border-border"
                    >
                    <Settings className="w-4 h-4" />
                    {t('my_profile')}
                    </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-error py-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary-light">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
