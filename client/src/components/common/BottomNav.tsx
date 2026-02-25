import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Leaf, Microscope, MessageCircle, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const BottomNav = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/crops', icon: Leaf, label: t('crops') },
    { to: '/chat/general', icon: MessageCircle, label: t('chat') },
    {
      to: user ? '/profile' : '/login',
      icon: User,
      label: user ? t('profile') : t('login')
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/10' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-area-inset-bottom bg-surface" />
    </nav>
  )
}

export default BottomNav