import { useState } from 'react'
import { Plus, Building2 } from 'lucide-react'
import Button from '@/components/common/Button'
import Loader from '@/components/common/Loader'
import EmptyState from '@/components/common/EmptyState'
import ConfirmModal from '@/components/common/ConfirmModal'
import { DepartmentCard } from '@/components/admin'
import DepartmentModal from '@/components/admin/DepartmentModal'
import { useDepartments } from '@/hooks/useDepartments'

export default function Departments() {
  const {
    departments = [],
    loading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment
  } = useDepartments();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Delete modal state
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddClick = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (dept) => {
    setDeptToDelete(dept);
  };

  const handleModalSubmit = async (formData) => {
    if (editingDept) {
      await editDepartment(editingDept.id, formData);
    } else {
      await addDepartment(formData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deptToDelete?.id) return;
    setIsDeleting(true);
    try {
      await removeDepartment(deptToDelete.id, deptToDelete.name, deptToDelete.code);
      setDeptToDelete(null);
    } catch (err) {
      console.error('Failed to delete department:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteDescription = deptToDelete
    ? `Are you sure you want to delete "${deptToDelete.name}" (${deptToDelete.code})?\n\nThis action cannot be undone.`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Departments</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {loading
              ? 'Loading academic departments...'
              : `${departments?.length ?? 0} academic departments registered in database`}
          </p>
        </div>
        <Button variant="primary" icon={Plus} size="md" onClick={handleAddClick}>
          Add Department
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="py-12 text-center text-rose-400 text-sm font-medium">
          {error}
        </div>
      ) : !departments || departments.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={Building2}
            title="No Departments Found"
            description="Get started by adding your first academic department."
            actionLabel="Add Department"
            onAction={handleAddClick}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <DepartmentCard
              key={d.id}
              department={d}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingDept}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deptToDelete)}
        onCancel={() => setDeptToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description={deleteDescription}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Department'}
        confirmVariant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
