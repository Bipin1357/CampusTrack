import { supabase } from '../supabase/supabaseClient';

export const academicRecordService = {
  /**
   * Fetch all academic records for a given student ID, sorted by semester.
   */
  async getStudentAcademicRecords(studentId) {
    if (!studentId) return [];

    const { data, error } = await supabase
      .from('student_academic_records')
      .select('*')
      .eq('student_id', studentId)
      .order('semester', { ascending: true });

    if (error) {
      console.error('Error fetching student academic records:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch academic record for a specific student and semester.
   */
  async getAcademicRecordBySemester(studentId, semester) {
    if (!studentId || !semester) return null;

    const { data, error } = await supabase
      .from('student_academic_records')
      .select('*')
      .eq('student_id', studentId)
      .eq('semester', Number(semester))
      .maybeSingle();

    if (error) {
      console.error(`Error fetching academic record for semester ${semester}:`, error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new academic record.
   */
  async createAcademicRecord(recordData) {
    const { student_id, semester, sgpa, credits_earned } = recordData;

    const numSgpa = Number(sgpa);
    const numCredits = Number(credits_earned);
    const numSem = Number(semester);

    if (isNaN(numSgpa) || numSgpa < 0 || numSgpa > 10) {
      throw new Error('SGPA must be a valid number between 0.00 and 10.00');
    }
    if (isNaN(numCredits) || numCredits <= 0) {
      throw new Error('Credits earned must be a number greater than 0');
    }

    // Check if record for semester already exists
    const existing = await this.getAcademicRecordBySemester(student_id, numSem);
    if (existing) {
      throw new Error(`An academic record for Semester ${numSem} already exists. Please edit the existing entry.`);
    }

    const { data, error } = await supabase
      .from('student_academic_records')
      .insert([
        {
          student_id,
          semester: numSem,
          sgpa: numSgpa,
          credits_earned: numCredits,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating academic record:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update an existing academic record.
   */
  async updateAcademicRecord(id, recordData) {
    const { semester, sgpa, credits_earned } = recordData;

    const numSgpa = Number(sgpa);
    const numCredits = Number(credits_earned);
    const numSem = Number(semester);

    if (isNaN(numSgpa) || numSgpa < 0 || numSgpa > 10) {
      throw new Error('SGPA must be a valid number between 0.00 and 10.00');
    }
    if (isNaN(numCredits) || numCredits <= 0) {
      throw new Error('Credits earned must be a number greater than 0');
    }

    const { data, error } = await supabase
      .from('student_academic_records')
      .update({
        semester: numSem,
        sgpa: numSgpa,
        credits_earned: numCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating academic record:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete an academic record.
   */
  async deleteAcademicRecord(id) {
    if (!id) return false;

    const { error } = await supabase
      .from('student_academic_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting academic record:', error);
      throw error;
    }

    return true;
  },

  /**
   * Calculate cumulative statistics from a list of academic records.
   */
  calculateStatistics(records = []) {
    if (!records || records.length === 0) {
      return {
        totalCredits: 0,
        cgpa: '0.00',
        highestSgpa: '0.00',
        completedSemesters: 0,
      };
    }

    let totalCredits = 0;
    let weightedSgpaSum = 0;
    let maxSgpa = 0;

    records.forEach((record) => {
      const sgpa = Number(record.sgpa) || 0;
      const credits = Number(record.credits_earned) || 0;

      totalCredits += credits;
      weightedSgpaSum += sgpa * credits;
      if (sgpa > maxSgpa) {
        maxSgpa = sgpa;
      }
    });

    const calculatedCgpa = totalCredits > 0 ? (weightedSgpaSum / totalCredits).toFixed(2) : '0.00';

    return {
      totalCredits,
      cgpa: calculatedCgpa,
      highestSgpa: maxSgpa.toFixed(2),
      completedSemesters: records.length,
    };
  },
};
