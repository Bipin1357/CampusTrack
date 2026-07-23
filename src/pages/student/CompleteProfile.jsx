import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { departments } from '../../data/departments';

export default function CompleteProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    department: '',
    semester: '',
    section: '',
    phone: '',
    gender: '',
    dob: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser?.uid) return;
        const profile = await studentService.getStudentById(currentUser.uid);
        if (profile) {
          setFormData({
            full_name: profile.full_name || currentUser.name || '',
            student_id: profile.student_id || '',
            department: profile.department || '',
            semester: profile.semester || '',
            section: profile.section || '',
            phone: profile.phone || '',
            gender: profile.gender || '',
            dob: profile.dob || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data.');
      } finally {
        setInitialFetchLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const validate = () => {
    const newErrors = {};
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (formData.student_id) {
        const isDuplicate = await studentService.checkStudentIdExists(formData.student_id, currentUser.uid);
        if (isDuplicate) {
          setErrors(prev => ({ ...prev, student_id: 'Student ID already exists' }));
          setLoading(false);
          return;
        }
      }

      await studentService.updateStudentByUserId(currentUser.uid, formData);
      toast.success('Profile completed successfully!');
      navigate('/student/dashboard', { replace: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialFetchLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-primary">
        <Loader2 className="h-10 w-10 animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden px-4 py-12">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent-secondary/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Complete Your Profile
          </h2>
          <p className="text-text-secondary mt-2">
            Please provide the following details to continue to your dashboard.
          </p>
        </div>

        <div className="bg-bg-secondary/70 backdrop-blur-xl border border-border-color p-8 rounded-[24px] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  readOnly
                  className="w-full px-4 py-3 bg-bg-primary/50 border border-border-color rounded-xl text-text-secondary cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Student ID (Optional)</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.student_id ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50`}
                  placeholder="e.g. STU12345"
                />
                {errors.student_id && <p className="text-red-500 text-xs pl-1">{errors.student_id}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.phone ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50`}
                  placeholder="e.g. +1 234 567 8900"
                />
                {errors.phone && <p className="text-red-500 text-xs pl-1">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Department <span className="text-red-500">*</span></label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.department ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-xs pl-1">{errors.department}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Semester <span className="text-red-500">*</span></label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.semester ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none`}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {errors.semester && <p className="text-red-500 text-xs pl-1">{errors.semester}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Section <span className="text-red-500">*</span></label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.section ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none`}
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D'].map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
                {errors.section && <p className="text-red-500 text-xs pl-1">{errors.section}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Gender <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.gender ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs pl-1">{errors.gender}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-bg-primary border ${errors.dob ? 'border-red-500' : 'border-border-color'} rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors [color-scheme:dark]`}
                />
                {errors.dob && <p className="text-red-500 text-xs pl-1">{errors.dob}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-accent-primary hover:bg-accent-hover text-[#0D0D0D] rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </motion.div>
    </div>
  );
}
