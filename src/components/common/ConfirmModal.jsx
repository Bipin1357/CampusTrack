import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  open,
  isOpen,
  title = 'Confirm Action',
  description,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  variant,
  loading = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const handleClose = onCancel ?? onClose;
  const activeVariant = confirmVariant ?? variant ?? 'danger';

  const rawText = description ?? message ?? 'Are you sure you want to continue?';
  const text = String(rawText || '').trim() || 'Are you sure you want to continue?';
  const lines = text.split('\n');

  const footer = (
    <>
      <Button variant="secondary" onClick={handleClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={activeVariant} onClick={onConfirm} disabled={loading}>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal open={isModalOpen} onClose={loading ? undefined : handleClose} title={title} footer={footer} size="sm">
      <div className="text-[var(--color-text-secondary)] text-sm space-y-1">
        {lines.map((line, i) => (
          <p key={i} className={line === '' ? 'h-2' : ''}>
            {line}
          </p>
        ))}
      </div>
    </Modal>
  );
}
