import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const footer = (
    <>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal open={open} onClose={loading ? undefined : onCancel} title={title} footer={footer} size="sm">
      <div className="text-[var(--color-text-secondary)]">
        {description.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        ))}
      </div>
    </Modal>
  );
}
