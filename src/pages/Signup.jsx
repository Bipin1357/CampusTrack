import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signup } from '../services/authService';
import { supabase } from '../supabase/supabaseClient';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (emailStr) => {
    return String(emailStr)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return pass.length >= 8 && hasUpper && hasLower && hasNumber;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});

    let currentErrors = {};

    if (!fullName.trim()) {
      currentErrors.fullName = 'Full Name cannot be empty';
    }

    if (!email) {
      currentErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      currentErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      currentErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      currentErrors.password = 'Password must be at least 8 characters, contain one uppercase, one lowercase, and one number';
    }

    if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    try {
      setLoading(true);
      const data = await signup(email, password);
      console.log("Signup response:", data);

const {
 data: { session }
} = await supabase.auth.getSession();

console.log("Current session:", session);
      const user = data.user;
      
      if (user) {
        const { data: insertedUser, error } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              name: fullName.trim(),
              email: email.toLowerCase(),
              role: "student",
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        console.log("========== USER INSERT ==========");
        console.log("Authenticated User:", user);
        console.log("Data Being Inserted:", {
          id: user.id,
          name: fullName.trim(),
          email: email.toLowerCase(),
          role: "student",
        });
        console.log("Insert Result:", insertedUser);
        console.log("Insert Error:", error);
        console.log("=================================");

        if (error) {
          throw error;
        }
      }

      toast.success('Account created successfully!');

      if (!data.session) {
        // Email confirmation is ON
        setSuccess(true);
      } else {
        // Email confirmation is OFF, user is logged in
        navigate('/student/dashboard', { replace: true });
      }

    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        toast.error('Email already registered');
        setErrors({ email: 'Email already registered' });
      } else if (msg.includes('weak_password') || msg.includes('Password should be')) {
        toast.error('Weak password');
        setErrors({ password: 'Weak password' });
      } else if (msg.includes('invalid_email')) {
        toast.error('Invalid email');
        setErrors({ email: 'Invalid email address' });
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(msg || 'Unknown server error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-accent-primary/10 blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent-secondary/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        <div className="bg-bg-secondary/70 backdrop-blur-xl border border-border-color p-8 rounded-[24px] shadow-2xl max-w-md w-full text-center z-10 relative">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Registration Successful</h2>
          <p className="text-text-secondary mb-6 text-lg">
            Your account has been created successfully.
          </p>
          <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-xl mb-6">
             <p className="text-text-primary">
               Please check your email to verify your account before logging in.
             </p>
          </div>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-accent-primary hover:bg-accent-hover text-[#0D0D0D] rounded-xl font-semibold transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden px-4 py-8">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-accent-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent-secondary/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="w-full max-w-md z-10 relative mt-8">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-secondary to-accent-primary shadow-[0_4px_12px_rgba(34,197,94,0.2)] mb-4 hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M4 7L12 3L20 7L12 11L4 7Z" fill="white" />
              <path
                d="M4 7V17L12 21L20 17V7"
                stroke="white"
                strokeWidth="1.6"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
            </svg>
          </Link>
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Create Account
          </h2>
          <p className="text-text-secondary mt-2">
            Join Campus Track as a Student
          </p>
        </div>

        <div className="bg-bg-secondary/70 backdrop-blur-xl border border-border-color p-8 rounded-[24px] shadow-2xl transition-all">
          <fieldset disabled={loading} className="disabled:opacity-70 disabled:cursor-not-allowed">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs pl-1 mt-1">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50"
                    placeholder="student@college.edu"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs pl-1 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs pl-1 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs pl-1 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-accent-primary hover:bg-accent-hover text-[#0D0D0D] rounded-xl font-semibold transition-all mt-6"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Signup;
