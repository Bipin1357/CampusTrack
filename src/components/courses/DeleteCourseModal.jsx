import Modal from '../common/Modal';
import Button from '../common/Button';

export default function DeleteCourseModal({ isOpen, onClose, onConfirm, course }) {
  if (!course) return null;

  if (isOpen) {
    console.log("Opening delete modal for course:", course.id);
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Delete Course">
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete <span className="font-semibold text-white">{course.course_code} - {course.course_name}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              console.log("Confirm Delete clicked for course:", course.id);
              onConfirm(course.id);
            }}
            className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
