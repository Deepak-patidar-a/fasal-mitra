import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer' as 'farmer' | 'expert',
    preferredLanguage: 'en' as 'en' | 'hi'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || t('register_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{t('create_account')}</h1>
          <p className="text-sm text-text-secondary">{t('register_subtitle')}</p>
        </div>

        {/* Form */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">{t('full_name')}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={t('full_name_placeholder')}
                className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">{t('email')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={t('email_placeholder')}
                className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">{t('phone')}</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder={t('phone_placeholder')}
                className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">{t('password')}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder={t('password_placeholder')}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">{t('role')}</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors"
                >
                  <option value="farmer">{t('farmer')}</option>
                  <option value="expert">{t('expert')}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">{t('language')}</label>
                <select
                  name="preferredLanguage"
                  value={form.preferredLanguage}
                  onChange={handleChange}
                  className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary transition-colors"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light mt-2"
            >
              {loading ? t('registering') : t('register')}
            </Button>

          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          {t('already_have_account')}{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            {t('login')}
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register