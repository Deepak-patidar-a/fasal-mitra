import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Github, Mail } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Leaf className="text-green-600 w-5 h-5" />
              <span className="text-lg font-bold text-primary">
                {t('app_name')}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('footer_description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
              {t('footer_quick_links')}
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {t('nav_home')}
              </Link>
              <Link
                to="/crops"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {t('nav_crops')}
              </Link>
              <Link
                to="/login"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
              {t('footer_contact')}
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:support@fasalmitra.com"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@fasalmitra.com
              </a>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            {t('footer_copyright')}
          </p>
          <p className="text-xs text-text-secondary">
            {t('footer_made_with')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer