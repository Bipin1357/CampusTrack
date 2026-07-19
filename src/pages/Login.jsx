import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login and forgot password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { login, resetPassword, loading: contextLoading } = useAuth();
  const loading = localLoading || contextLoading;

  const handleAuthError = (err) => {
    const msg = err.message || '';
    if (msg.includes('Invalid login credentials')) {
      return 'Invalid email or password.';
    } else if (msg.includes('Email not confirmed')) {
      return 'Please verify your email address before logging in.';
    } else if (msg.includes('User not found')) {
      return 'No user found with this email.';
    } else if (msg.includes('Failed to fetch')) {
      return 'Network error. Please check your connection.';
    }
    return msg || 'An unexpected error occurred. Please try again.';
  };

  const validateEmail = (emailStr) => {
    return String(emailStr)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password) {
      toast.error('Password is required.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLocalLoading(true);
      await login(email, password);
      toast.success('Login successful!');
    } catch (err) {
      toast.error(handleAuthError(err));
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email to reset your password.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setLocalLoading(true);
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setIsLogin(true);
    } catch (err) {
      toast.error(handleAuthError(err));
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden px-4">
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

      <div className="w-full max-w-md z-10 relative">
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
            {isLogin ? 'Welcome back' : 'Reset Password'}
          </h2>
          <p className="text-text-secondary mt-2">
            {isLogin
              ? 'Enter your credentials to access your dashboard'
              : 'Enter your email to receive reset instructions'}
          </p>
        </div>

        <div className="bg-bg-secondary/70 backdrop-blur-xl border border-border-color p-8 rounded-[24px] shadow-2xl transition-all">
          <fieldset disabled={loading} className="disabled:opacity-70 disabled:cursor-not-allowed">
            <form onSubmit={isLogin ? handleLogin : handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary pl-1 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors placeholder:text-text-secondary/50"
                    placeholder="student@college.edu"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-sm font-medium text-text-secondary block">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                      }}
                      className="text-sm text-accent-primary hover:text-accent-hover transition-colors font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-accent-primary hover:bg-accent-hover text-[#0D0D0D] rounded-xl font-semibold transition-all mt-2"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {isLogin ? 'Sign In' : 'Send Reset Link'}
              </button>
            </form>

            {!isLogin ? (
              <button
                onClick={() => {
                  setIsLogin(true);
                }}
                className="mt-6 flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-full"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </button>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Login;
