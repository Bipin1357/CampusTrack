import { supabase } from '../supabase/supabaseClient';
import { supabaseAdmin } from '../supabase/supabaseAdmin';

export const studentService = {
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getStudentById(id) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
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
      id: authData.user.id,
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

  async updateStudent(id, studentData) {
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

    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()

      .single();
      
    if (error) throw error;
    return data;
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
