import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Leaf
} from 'lucide-react'
import { getUserOrders } from '@/services/orderService'

interface Order {
  _id: string
  listing: {
    _id: string
    price: number
    seller: { name: string; contact: string }
    product: {
      name: { en: string; hi: string }
      type: string
    }
  }
  quantity: number
  totalAmount: number
  status: 'pending' | 'paid' | 'failed'
  createdAt: string
}

const statusConfig = {
  paid: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    label: 'Paid'
  },
  pending: {
    icon: Clock,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    label: 'Pending'
  },
  failed: {
    icon: XCircle,
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/20',
    label: 'Failed'
  }
}

const Orders = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders()
        setOrders(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Leaf className="w-10 h-10 text-primary animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{t('my_orders')}</h1>
            <p className="text-sm text-text-secondary">{t('my_orders_desc')}</p>
          </div>
        </div>

        {/* Empty state */}
        {orders.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="bg-primary/10 p-6 rounded-full">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-text-primary">
                {t('no_orders_title')}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {t('no_orders_desc')}
              </p>
            </div>
            <button
              onClick={() => navigate('/crops')}
              className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
            >
              {t('browse_crops')}
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <XCircle className="w-10 h-10 text-error" />
            <p className="text-text-secondary text-sm">{t('something_went_wrong')}</p>
          </div>
        )}

        {/* Orders list */}
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon

            return (
              <div
                key={order._id}
                className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">
                        {order.listing?.product?.name?.[lang] || 'Product'}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {t('ordered_on')} {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 ${status.color} ${status.bg} ${status.border}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Order details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary">{t('seller')}</p>
                    <p className="text-sm font-medium text-text-primary mt-0.5">
                      {order.listing?.seller?.name || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t('quantity')}</p>
                    <p className="text-sm font-medium text-text-primary mt-0.5">
                      {order.quantity} {t('unit')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t('price_per_unit')}</p>
                    <p className="text-sm font-medium text-text-primary mt-0.5">
                      ₹{order.listing?.price || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t('total_amount')}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Delivery info for paid orders */}
                {order.status === 'paid' && (
                  <div className="flex items-center gap-2 bg-success/10 text-success text-xs px-3 py-2 rounded-lg">
                    <Truck className="w-4 h-4 shrink-0" />
                    {t('order_confirmed_delivery')}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Orders