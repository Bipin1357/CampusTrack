import { Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import { DepartmentCard } from '@/components/admin'
import { departments } from '@/data/departmentData'

export default function Departments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Departments</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{departments.length} academic departments across campus</p>
        </div>
        <Button variant="primary" icon={Plus} size="md">Add Department</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <DepartmentCard key={d.id} department={d} />
        ))}
      </div>
    </div>
  )
}
