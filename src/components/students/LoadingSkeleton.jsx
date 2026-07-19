import Card from '../common/Card';

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-[var(--color-border)] animate-pulse">
          <div className="w-10 h-10 rounded-full bg-white/5"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded w-1/4"></div>
            <div className="h-3 bg-white/5 rounded w-1/3"></div>
          </div>
          <div className="h-4 bg-white/5 rounded w-24 hidden md:block"></div>
          <div className="h-4 bg-white/5 rounded w-20 hidden md:block"></div>
          <div className="h-6 bg-white/5 rounded-full w-16"></div>
          <div className="w-8 h-8 rounded-md bg-white/5"></div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="p-8 h-48 bg-white/5"></Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 h-64 bg-white/5"></Card>
          <Card className="p-6 h-48 bg-white/5"></Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 h-32 bg-white/5"></Card>
            <Card className="p-5 h-32 bg-white/5"></Card>
            <Card className="p-5 h-32 bg-white/5"></Card>
          </div>
          <Card className="p-6 h-64 bg-white/5"></Card>
        </div>
      </div>
    </div>
  );
}
