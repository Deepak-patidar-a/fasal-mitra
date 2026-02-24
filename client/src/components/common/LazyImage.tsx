import { useState, useRef, useEffect } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
}

const LazyImage = ({ src, alt, className, fallback }: Props) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={className}>
      {inView && !error ? (
        <>
          {!loaded && (
            <div className="w-full h-full bg-border animate-pulse rounded" />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : error ? (
        <>{fallback}</>
      ) : (
        <div className="w-full h-full bg-border animate-pulse rounded" />
      )}
    </div>
  )
}

export default LazyImage