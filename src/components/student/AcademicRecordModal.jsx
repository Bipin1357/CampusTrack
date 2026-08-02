import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';

export default function AcademicRecordModal({ isOpen, onClose, onSubmit, record = null, defaultSemester = 1 }) {
  const [formData, setFormData] = useState({
    semester: String(defaultSemester),
    sgpa: '',
    credits_earned: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record && isOpen) {
      setFormData({
        semester: String(record.semester),
        sgpa: String(record.sgpa ?? ''),
        credits_earned: String(record.credits_earned ?? ''),
      });
    } else if (isOpen) {
      setFormData({
        semester: String(defaultSemester || 1),
        sgpa: '',
        credits_earned: '20', // Default credits fallback suggestion
      });
    }
    setErrors({});
  }, [record, isOpen, defaultSemester]);

  const validate = () => {
    const newErrors = {};

    const numSgpa = Number(formData.sgpa);
    if (!formData.sgpa || isNaN(numSgpa) || numSgpa < 0 || numSgpa > 10) {
      newErrors.sgpa = 'SGPA must be between 0.00 and 10.00';
    }

    const numCredits = Number(formData.credits_earned);
    if (!formData.credits_earned || isNaN(numCredits) || numCredits <= 0) {
      newErrors.credits_earned = 'Credits earned must be greater than 0';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        semester: Number(formData.semester),
        sgpa: Number(formData.sgpa),
        credits_earned: Number(formData.credits_earned),
      });
      onClose();
    } catch (err) {
      console.error('Error submitting academic record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={record ? `Edit Semester ${formData.semester} Record` : `Add Semester ${formData.semester} Record`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Semester Selection */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Semester</label>
          <Select
            value={formData.semester}
            onValueChange={(val) => {
              setFormData((prev) => ({ ...prev, semester: val }));
              if (errors.semester) setErrors((prev) => ({ ...prev, semester: null }));
            }}
            disabled={Boolean(record)} // Lock semester if editing
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={String(sem)}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester && <p className="text-red-400 text-xs mt-1">{errors.semester}</p>}
        </div>

        {/* SGPA Input */}
        <div>
          <Input
            label="SGPA (0.00 - 10.00) *"
            name="sgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="e.g. 8.52"
            value={formData.sgpa}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, sgpa: e.target.value }));
              if (errors.sgpa) setErrors((prev) => ({ ...prev, sgpa: null }));
            }}
            error={errors.sgpa}
            required
          />
        </div>

        {/* Credits Earned Input */}
        <div>
          <Input
            label="Credits Earned *"
            name="credits_earned"
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 22"
            value={formData.credits_earned}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, credits_earned: e.target.value }));
              if (errors.credits_earned) setErrors((prev) => ({ ...prev, credits_earned: null }));
            }}
            error={errors.credits_earned}
            required
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : record ? 'Update Record' : 'Save Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
