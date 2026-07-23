import { supabase } from '../supabase/supabaseClient';
import { supabaseAdmin } from '../supabase/supabaseAdmin';

export const studentService = {
  async getStudents(options = {}) {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      filters = {},
      sortKey = 'created_at',
      sortDir = 'desc'
    } = options;

    console.log("Search received:", search);

    let query = supabase
      .from("students")
      .select("*", { count: "exact" });

    if (search) {
      console.log("Applying search");
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    console.log({ data, error, count });

    if (error) throw error;

    return { data, count };
  },

  async getStudentById(userId) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async checkStudentIdExists(studentId, excludeUserId = null) {
    if (!studentId) return false;
    let query = supabase
      .from("students")
      .select("id")
      .eq("student_id", studentId);
      
    if (excludeUserId) {
      query = query.neq("user_id", excludeUserId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data.length > 0;
  },

  async createStudent(studentData) {
    // 1. Create auth user using secondary client to prevent admin logout
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: studentData.email,
      password: studentData.password, // Typically passed in, or default generated
      options: {
        data: {
          role: 'student',
          full_name: studentData.full_name,
        }
      }
    });

    if (authError) {
      console.error("Auth signup failed:", authError);
      if (authError.message?.toLowerCase().includes('already registered') || authError.status === 422) {
        throw new Error("A user with this email address is already registered.");
      }
      throw authError;
    }

    const { password, confirmPassword, ...restData } = studentData;
    
    const studentProfileData = {
      id: crypto.randomUUID(),
      user_id: authData.user.id,
      student_id: restData.student_id,
      full_name: restData.full_name,
      email: restData.email,
      phone: restData.phone,
      gender: restData.gender,
      dob: restData.dob,
      department: restData.department,
      semester: restData.semester,
      section: restData.section,
      status: restData.status,
      role: restData.role || 'student'
    };

    console.log("Student payload:", studentProfileData);

    // 2. Create student record
    const { data, error } = await supabase
      .from('students')
      .insert(studentProfileData)
      .select()
      .single();
      
    if (error) {
      console.error("Student insert failed:", error);
      throw new Error(`Auth account may already exist, or database error occurred: ${error.message}`);
    }
    
    return data;
  },

  async updateStudentByUserId(userId, studentData) {
    const { password, confirmPassword, ...restData } = studentData;

    const updateData = {
      student_id: restData.student_id,
      full_name: restData.full_name,
      email: restData.email,
      phone: restData.phone,
      gender: restData.gender,
      dob: restData.dob,
      department: restData.department,
      semester: restData.semester,
      section: restData.section,
      status: restData.status,
      role: restData.role
    };

    // Remove any undefined fields so we don't overwrite with nulls accidentally
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    console.log("Updating student:", {
      userId,
      studentData
    });

    const { data: existingRow, error: existingError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId);

    console.log('Existing row:', existingRow);
    console.log('Existing row error:', existingError);

    const { error } = await supabase
      .from('students')
      .update(updateData)
      .eq('user_id', userId);

    if (error) throw error;

    const { data: updatedRow, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId);

    console.log('Updated row:', updatedRow);
    console.log('Fetch error:', fetchError);

    return updatedRow?.[0];
  },

  async deleteStudent(id) {
    // Deleting from 'students' table.
    // NOTE: Ideally, you also delete the auth user, which requires a Supabase Edge Function 
    // or the service_role_key. For this phase, we just remove the public profile. 
    // If ON DELETE CASCADE is set up and we delete the auth user, the profile drops automatically.
    // For now, we drop the profile.
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
