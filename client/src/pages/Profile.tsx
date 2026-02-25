import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Leaf, Clock, ShoppingBag, Heart } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import { Link } from 'react-router-dom'


const Profile = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) return null

  return (
    <PageTransition>
    <div className="min-h-screen bg-background px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
          {t('my_profile')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-text-primary">{user.name}</h2>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mt-1 inline-block">
                  {t(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="md:col-span-2">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
                {t('account_info')}
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <User className="w-4 h-4 text-text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-text-secondary">{t('full_name')}</p>
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <Mail className="w-4 h-4 text-text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-text-secondary">{t('email')}</p>
                    <p className="text-sm font-medium text-text-primary">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <Leaf className="w-4 h-4 text-text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-text-secondary">{t('role')}</p>
                    <p className="text-sm font-medium text-text-primary">{t(user.role)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <Clock className="w-4 h-4 text-text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-text-secondary">{t('preferred_language')}</p>
                    <p className="text-sm font-medium text-text-primary">
                      {user.preferredLanguage === 'en' ? 'English' : 'हिंदी'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
              {t('quick_links')}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-text-primary">{t('my_orders')}</span>
              </Link>
              <Link
                  to="/saved-crops"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-text-primary">{t('saved_crops')}</span>
                </Link>
              <Link
                to="/crops"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-text-primary">{t('browse_crops')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}

export default Profile