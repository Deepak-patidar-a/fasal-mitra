import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Package,
  Star,
  AlertTriangle,
  Leaf,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/services/productService'
import { useAuth } from '@/context/AuthContext'
import { useRazorpay } from '@/hooks/useRazorpay'

interface Listing {
  _id: string
  seller: { name: string; contact: string }
  price: number
  stock: number
  deliveryDays: number
}

interface Product {
  _id: string
  name: { en: string; hi: string }
  type: 'fertilizer' | 'pesticide'
  description: { en: string; hi: string }
  images: string[]
  listings: Listing[]
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const { initiatePayment, processing } = useRazorpay()
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(false)
        const data = await getProductById(id as string)
        setProduct(data)
        // Auto select cheapest listing
        if (data.listings?.length > 0) {
          const cheapest = [...data.listings].sort(
            (a: Listing, b: Listing) => a.price - b.price
          )[0]
          setSelectedListing(cheapest)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])
  
    const handleBuyNow = () => {
    if (!selectedListing || !user || !product) return

    initiatePayment({
        listingId: selectedListing._id,
        quantity: 1,
        productName: product.name.en,
        userName: user.name,
        userEmail: user.email,
        onSuccess: () => setPaymentSuccess(true),
        onFailure: () => alert(t('payment_failed'))
    })
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Leaf className="w-10 h-10 text-primary animate-pulse" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-error" />
          <h2 className="text-xl font-bold text-text-primary">{t('product_not_found')}</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>
        </div>
      </div>
    )
  }

  // Sort listings by price ascending
  const sortedListings = [...product.listings].sort((a, b) => a.price - b.price)

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="flex flex-col md:flex-row gap-8">

            {/* Product Image */}
            <div className="w-full md:w-64 h-64 bg-surface border border-border rounded-2xl flex items-center justify-center shrink-0">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name[lang]}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <Package className="w-20 h-20 text-text-secondary/30" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {t(product.type)}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-3">
                  {product.name[lang]}
                </h1>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                  {product.description[lang]}
                </p>
              </div>

              {/* Best Price */}
              {selectedListing && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ₹{selectedListing.price}
                  </span>
                  <span className="text-sm text-text-secondary">{t('per_unit')}</span>
                  {sortedListings[0]._id === selectedListing._id && (
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t('best_price')}
                    </span>
                  )}
                </div>
              )}

              {/* Delivery info */}
              {selectedListing && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Truck className="w-4 h-4 text-primary" />
                  {t('delivery_in')} {selectedListing.deliveryDays} {t('days')}
                </div>
              )}

              {/* Buy Button */}
                {paymentSuccess ? (
                <div className="flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-xl w-full md:w-64 justify-center font-medium">
                    ✓ {t('payment_success')}
                </div>
                ) : user ? (
                <Button
                    className="w-full md:w-64 bg-primary hover:bg-primary-light"
                    onClick={handleBuyNow}
                    disabled={processing}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {processing ? t('processing') : t('buy_now')}
                </Button>
                ) : (
                <Button
                    className="w-full md:w-64"
                    variant="outline"
                    onClick={() => navigate('/login')}
                >
                    {t('login_to_buy')}
                </Button>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {t('compare_prices')}
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            {t('compare_prices_desc')}
          </p>

          <div className="flex flex-col gap-3">
            {sortedListings.map((listing, idx) => (
              <button
                key={listing._id}
                onClick={() => setSelectedListing(listing)}
                className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedListing?._id === listing._id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-surface hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    idx === 0
                      ? 'bg-success/10 text-success'
                      : 'bg-background text-text-secondary'
                  }`}>
                    {idx + 1}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {listing.seller.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Truck className="w-3 h-3" />
                        {listing.deliveryDays} {t('days')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Package className="w-3 h-3" />
                        {listing.stock} {t('in_stock')}
                      </span>
                      <a
                        href={`tel:${listing.seller.contact}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {listing.seller.contact}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-12 sm:pl-0">
                  <span className="text-xl font-bold text-text-primary">
                    ₹{listing.price}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                      {t('lowest')}
                    </span>
                  )}
                  {selectedListing?._id === listing._id && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {t('selected')}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default ProductDetail