import { supabase } from '../supabase/supabaseClient';

export const courseService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCourseById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  async createCourse(courseData) {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateCourse(id, courseData) {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async deleteCourse(id) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
