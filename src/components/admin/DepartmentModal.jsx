import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#22c55e', // Emerald
  '#a78bfa', // Purple
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#ec4899', // Pink
];

export default function DepartmentModal({ open, isOpen, onClose, onSubmit, initialData, title }) {
  const activeOpen = open ?? isOpen ?? false;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#6366f1'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && activeOpen) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        description: initialData.description || '',
        color: initialData.color || '#6366f1'
      });
    } else if (activeOpen) {
      setFormData({
        name: '',
        code: '',
        description: '',
        color: '#6366f1'
      });
    }
    setErrors({});
  }, [initialData, activeOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Department Name is required.';
    if (!formData.code.trim()) newErrors.code = 'Department Code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={activeOpen}
      onClose={onClose}
      title={title || (initialData ? 'Edit Department' : 'Add Department')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name *"
          name="name"
          placeholder="e.g. Computer Science & Engineering"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Department Code *"
          name="code"
          placeholder="e.g. CSE"
          value={formData.code}
          onChange={handleChange}
          error={errors.code}
          required
        />

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Description (Optional)</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Brief department overview or focus area..."
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/[0.03] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Department Color Accent</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                className={`w-7 h-7 rounded-full transition-transform ${
                  formData.color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Department' : 'Create Department'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
