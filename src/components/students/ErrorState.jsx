import { AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center h-64">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Failed to load data</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md">
        {message || "An unexpected error occurred while loading the data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </Card>
  );
}
