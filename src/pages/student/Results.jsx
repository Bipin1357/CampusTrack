import React, { useState } from 'react';
import { Award, GraduationCap, BookOpen, Plus, Edit2, Trash2, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAcademicRecords } from '../../hooks/useAcademicRecords';
import AcademicRecordModal from '../../components/student/AcademicRecordModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function StudentResults() {
  const { currentUser, loading: authLoading } = useAuth();
  const student = currentUser?.studentProfile;
  const { records, stats, loading: recordsLoading, addRecord, editRecord, removeRecord } = useAcademicRecords(student?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [targetSemester, setTargetSemester] = useState(1);

  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Map records by semester number (1 to 8)
  const recordBySemester = {};
  records.forEach((r) => {
    recordBySemester[r.semester] = r;
  });

  const handleAddClick = (semNum = 1) => {
    setSelectedRecord(null);
    setTargetSemester(semNum);
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setTargetSemester(record.semester);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      await removeRecord(recordToDelete.id, recordToDelete.semester);
      setRecordToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (formData) => {
    if (selectedRecord) {
      await editRecord(selectedRecord.id, formData);
    } else {
      console.log({
        authUserId: currentUser?.uid,
        studentTableId: student?.id,
        payload: {
          ...formData,
          student_id: student?.id,
        },
      });
      await addRecord(formData);
    }
  };

  if (authLoading || !student || (recordsLoading && records.length === 0)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const hasRecords = records.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#34D399]" />
            Academic Records & Results
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Track your semester SGPA, earned credits, and overall CGPA progress.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => handleAddClick(1)}>
          Add Semester GPA
        </Button>
      </div>

      {/* Top 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-white/10 rounded-[20px] p-5 flex flex-col hover:border-[#10B981]/40 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">
              Current CGPA
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-bold font-display text-[#34D399]">{stats.cgpa}</div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Weighted cumulative grade</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/10 rounded-[20px] p-5 flex flex-col hover:border-[#10B981]/40 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">
              Total Credits
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-bold font-display text-white">{stats.totalCredits}</div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Credits completed</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/10 rounded-[20px] p-5 flex flex-col hover:border-[#10B981]/40 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">
              Highest SGPA
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-bold font-display text-emerald-400">{stats.highestSgpa}</div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Best semester performance</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/10 rounded-[20px] p-5 flex flex-col hover:border-[#10B981]/40 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">
              Semesters
            </span>
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-bold font-display text-white">{stats.completedSemesters} / 8</div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Completed terms</p>
          </div>
        </div>
      </div>

      {/* Empty State Banner if no records exist at all */}
      {!hasRecords && (
        <div className="bg-[#1E293B] border border-dashed border-[#10B981]/30 rounded-[24px] p-10 text-center space-y-4 shadow-xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/15 text-[#34D399] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">No Academic Records Yet</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-md mx-auto">
              Start by adding your Semester 1 GPA to begin tracking your academic progress.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => handleAddClick(1)}>
            Add Semester 1 GPA
          </Button>
        </div>
      )}

      {/* 8 Semester Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#34D399]" />
          Semester Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
            const record = recordBySemester[semNum];

            if (record) {
              return (
                <div
                  key={semNum}
                  className="bg-[#1E293B] border border-white/10 hover:border-[#10B981]/40 rounded-[20px] p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#34D399] uppercase tracking-wider">
                      Semester {semNum}
                    </span>
                    <button
                      onClick={() => handleEditClick(record)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-4">
                    <div className="text-xs text-[var(--color-text-muted)]">SGPA</div>
                    <div className="text-3xl font-bold font-display text-white mt-0.5">
                      {Number(record.sgpa).toFixed(2)}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>Credits</span>
                    <span className="font-semibold text-white">{record.credits_earned}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={semNum}
                className="bg-white/[0.02] border border-dashed border-white/10 hover:border-[#10B981]/30 rounded-[20px] p-5 flex flex-col justify-between transition-all duration-300"
              >
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Semester {semNum}
                </span>

                <div className="my-4 py-2">
                  <p className="text-xs text-[var(--color-text-muted)]">No data available</p>
                </div>

                <button
                  onClick={() => handleAddClick(semNum)}
                  className="w-full py-2 px-3 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/20 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add GPA
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Academic History Table */}
      {hasRecords && (
        <div className="bg-[#1E293B] border border-white/10 rounded-[24px] p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Detailed Academic History</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-[#94A3B8] uppercase">
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">SGPA</th>
                  <th className="py-3 px-4">Credits Earned</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-[var(--color-text-secondary)]">
                {[...records]
                  .sort((a, b) => b.semester - a.semester)
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#10B981]/[0.05] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">Semester {rec.semester}</td>
                      <td className="py-3.5 px-4 font-bold text-[#34D399]">{Number(rec.sgpa).toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-white">{rec.credits_earned}</td>
                      <td className="py-3.5 px-4 text-xs text-[var(--color-text-muted)] font-mono">
                        {rec.updated_at
                          ? new Date(rec.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(rec)}
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(rec)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reusable Add/Edit Modal */}
      <AcademicRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        record={selectedRecord}
        defaultSemester={targetSemester}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(recordToDelete)}
        title="Delete Academic Record"
        description={`Are you sure you want to delete the record for Semester ${recordToDelete?.semester}?\n\nThis will recalculate your overall CGPA and total credits.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setRecordToDelete(null)}
      />
    </div>
  );
}
