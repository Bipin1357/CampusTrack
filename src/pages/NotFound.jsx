import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[var(--color-bg-base)]">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center mb-5">
        <Compass className="w-7 h-7 text-violet-300" />
      </div>
      <h1 className="font-display text-3xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/admin/dashboard">
        <Button variant="primary">Back to Dashboard</Button>
      </Link>
    </div>
  )
}
