import Modal from '../common/Modal';
import Button from '../common/Button';

export default function DeleteStudentModal({ isOpen, onClose, onConfirm, student }) {
  if (!student) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Delete Student">
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete <span className="font-semibold text-white">{student.full_name} ({student.student_id})</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => onConfirm(student.id)}
            className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
