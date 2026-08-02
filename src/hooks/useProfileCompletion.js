import { useAuth } from '../context/AuthContext';

/**
 * Utility function to calculate profile completion details from user and profile objects.
 */
export function calculateProfileCompletion(user, profileOverride = null) {
  const profile = profileOverride || user?.studentProfile || {};

  const fields = [
    {
      id: 'name',
      label: 'Full Name',
      description: 'Your registered full name',
      completed: Boolean(profile?.full_name || user?.name),
    },
    {
      id: 'email',
      label: 'Email Address',
      description: 'Your registered email account',
      completed: Boolean(user?.email || profile?.email),
    },
    {
      id: 'phone',
      label: 'Phone Number',
      description: 'Contact phone number',
      completed: Boolean(profile?.phone),
    },
    {
      id: 'dob',
      label: 'Date of Birth',
      description: 'Birth date information',
      completed: Boolean(profile?.dob),
    },
    {
      id: 'gender',
      label: 'Gender',
      description: 'Gender selection',
      completed: Boolean(profile?.gender),
    },
    {
      id: 'department',
      label: 'Department',
      description: 'Assigned academic department',
      completed: Boolean(profile?.department || profile?.department_id),
    },
    {
      id: 'semester',
      label: 'Semester',
      description: 'Current active semester',
      completed: Boolean(profile?.semester),
    },
    {
      id: 'section',
      label: 'Section',
      description: 'Assigned class section',
      completed: Boolean(profile?.section),
    },
    {
      id: 'student_id',
      label: 'Student ID / Roll No',
      description: 'Official student identification number',
      completed: Boolean(profile?.student_id),
    },
    {
      id: 'photo',
      label: 'Profile Photo',
      description: 'Profile avatar or photo URL',
      completed: Boolean(user?.photoURL || profile?.profile_url),
    },
  ];

  const completedCount = fields.filter((f) => f.completed).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const remainingCount = totalCount - completedCount;

  let statusText = '';
  if (remainingCount === 0) {
    statusText = 'All required information completed.';
  } else if (remainingCount === 1) {
    statusText = 'Complete 1 remaining field';
  } else {
    statusText = `Complete ${remainingCount} remaining fields`;
  }

  return {
    percentage,
    completedCount,
    totalCount,
    remainingCount,
    statusText,
    isComplete: percentage === 100,
    items: fields,
  };
}

/**
 * Custom React hook for dynamic profile completion calculation across the Student Portal.
 */
export function useProfileCompletion(profileOverride = null) {
  const { currentUser } = useAuth();
  return calculateProfileCompletion(currentUser, profileOverride);
}
