import { supabase } from '../supabase/supabaseClient';

export const enrollmentService = {
  /**
   * Fetch all enrollments for a specific course, including student details.
   */
  async getEnrollmentsByCourse(courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        status,
        student:students (
          id,
          student_id,
          full_name,
          email,
          department,
          semester
        )
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    
    // Map data to a flat structure for easier table rendering
    // Fallback safely in case student is null (if a student was deleted but enrollment wasn't cascaded properly)
    return data
      .filter(enrollment => enrollment.student != null)
      .map(enrollment => ({
        enrollment_id: enrollment.id,
        enrolled_at: enrollment.enrolled_at,
        enrollment_status: enrollment.status,
        ...enrollment.student
      }));
  },

  /**
   * Enroll multiple students into a course.
   */
  async enrollStudents(courseId, studentIds) {
    const enrollmentsToInsert = studentIds.map(studentId => ({
      course_id: courseId,
      student_id: studentId,
      status: 'active'
    }));

    const { data, error } = await supabase
      .from('enrollments')
      .insert(enrollmentsToInsert)
      .select();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('One or more students are already enrolled in this course.');
      }
      throw error;
    }

    return data;
  },

  /**
   * Remove a student from a course (delete enrollment record).
   */
  async removeEnrollment(enrollmentId) {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId);

    if (error) throw error;
    return true;
  },

  /**
   * Fetch all students, highlighting which ones are already enrolled in the given course.
   */
  async getAvailableStudents(courseId, search = '') {
    // 1. Get all students
    let query = supabase.from('students').select('*');
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`);
    }
    
    const { data: allStudents, error: studentError } = await query.order('full_name', { ascending: true });
    
    if (studentError) throw studentError;

    // 2. Get current enrollments for this course
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId);

    if (enrollError) throw enrollError;

    const enrolledStudentIds = new Set(enrollments.map(e => e.student_id));

    // 3. Mark students as enrolled if they are in the set
    return allStudents.map(student => ({
      ...student,
      is_enrolled: enrolledStudentIds.has(student.id)
    }));
  }
};
