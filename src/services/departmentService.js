import { supabase } from '../supabase/supabaseClient';

export const departmentService = {
  /**
   * Fetch all departments ordered by name with live student and course counts.
   */
  async getDepartments() {
    // 1. Fetch departments
    const { data: deptData, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (deptError) {
      console.error('Error fetching departments:', deptError);
      throw deptError;
    }

    const depts = deptData || [];

    // 2. Fetch student department associations to calculate counts
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('department, department_id');

    if (studentsError) {
      console.error('Error fetching student department counts:', studentsError);
    }

    // 3. Fetch course department associations to calculate counts
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('department, department_id');

    if (coursesError) {
      console.error('Error fetching course department counts:', coursesError);
    }

    const students = studentsData || [];
    const courses = coursesData || [];

    // Map live counts onto each department object
    return depts.map((d) => {
      const studentCount = students.filter(
        (s) => s.department_id === d.id || (s.department && (s.department === d.code || s.department === d.name))
      ).length;

      const courseCount = courses.filter(
        (c) => c.department_id === d.id || (c.department && (c.department === d.code || c.department === d.name))
      ).length;

      return {
        ...d,
        student_count: studentCount,
        course_count: courseCount
      };
    });
  },

  /**
   * Fetch single department by ID
   */
  async getDepartment(id) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new department
   */
  async createDepartment(departmentData) {
    const { name, code, description, color } = departmentData;

    if (!name || !name.trim()) throw new Error('Department name is required.');
    if (!code || !code.trim()) throw new Error('Department code is required.');

    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    // Check duplicate name or code (case-insensitive)
    const { data: existing, error: checkError } = await supabase
      .from('departments')
      .select('id, name, code');

    if (!checkError && existing) {
      const nameExists = existing.some(
        (d) => d.name.toLowerCase() === trimmedName.toLowerCase()
      );
      const codeExists = existing.some(
        (d) => d.code.toLowerCase() === trimmedCode.toLowerCase()
      );

      if (nameExists) {
        throw new Error(`A department with the name "${trimmedName}" already exists.`);
      }
      if (codeExists) {
        throw new Error(`A department with the code "${trimmedCode}" already exists.`);
      }
    }

    const newDepartment = {
      name: trimmedName,
      code: trimmedCode,
      description: description ? description.trim() : null,
      color: color || '#10B981'
    };

    const { data, error } = await supabase
      .from('departments')
      .insert([newDepartment])
      .select()
      .single();

    if (error) {
      console.error('Failed to create department:', error);
      throw new Error(error.message || 'Failed to create department.');
    }

    return data;
  },

  /**
   * Update an existing department
   */
  async updateDepartment(id, departmentData) {
    const { name, code, description, color } = departmentData;

    if (!name || !name.trim()) throw new Error('Department name is required.');
    if (!code || !code.trim()) throw new Error('Department code is required.');

    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    // Check duplicate name or code (excluding current ID)
    const { data: existing, error: checkError } = await supabase
      .from('departments')
      .select('id, name, code')
      .neq('id', id);

    if (!checkError && existing) {
      const nameExists = existing.some(
        (d) => d.name.toLowerCase() === trimmedName.toLowerCase()
      );
      const codeExists = existing.some(
        (d) => d.code.toLowerCase() === trimmedCode.toLowerCase()
      );

      if (nameExists) {
        throw new Error(`A department with the name "${trimmedName}" already exists.`);
      }
      if (codeExists) {
        throw new Error(`A department with the code "${trimmedCode}" already exists.`);
      }
    }

    const updatePayload = {
      name: trimmedName,
      code: trimmedCode,
      description: description ? description.trim() : null,
      color: color || '#10B981'
    };

    const { data, error } = await supabase
      .from('departments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update department:', error);
      throw new Error(error.message || 'Failed to update department.');
    }

    return data;
  },

  /**
   * Delete a department (blocked if linked to active students or courses)
   */
  async deleteDepartment(id, name = '', code = '') {
    // 1. Check linked students by department_id or department name/code
    const { data: linkedStudents, error: studentErr } = await supabase
      .from('students')
      .select('id')
      .or(`department_id.eq.${id},department.eq."${code}",department.eq."${name}"`);

    if (!studentErr && linkedStudents && linkedStudents.length > 0) {
      throw new Error(
        `Cannot delete department "${name || code}" because ${linkedStudents.length} student(s) are currently enrolled in it.`
      );
    }

    // 2. Check linked courses by department_id or department name/code
    const { data: linkedCourses, error: courseErr } = await supabase
      .from('courses')
      .select('id')
      .or(`department_id.eq.${id},department.eq."${code}",department.eq."${name}"`);

    if (!courseErr && linkedCourses && linkedCourses.length > 0) {
      throw new Error(
        `Cannot delete department "${name || code}" because ${linkedCourses.length} active course(s) belong to it.`
      );
    }

    // 3. Delete department
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete department:', error);
      throw new Error(error.message || 'Failed to delete department.');
    }

    return true;
  }
};
