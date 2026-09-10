import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sparkles, Check, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, ChefHat } from 'lucide-react';

export const AuthLandingPage: React.FC = () => {
  const { signIn, signUp, switchDemoRole, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('customer@dreamcake.ai');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Signup Form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    const success = await signIn(loginEmail, loginPassword);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'staff') navigate('/staff/dashboard');
      else if (user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/customer/home');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!signupName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setFormError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    const success = await signUp(signupEmail, signupPassword, signupName, signupPhone);
    if (success) {
      navigate('/customer/home');
    }
  };

  const handleQuickDemo = async (role: 'customer' | 'staff' | 'admin') => {
    await switchDemoRole(role);
    if (role === 'customer') navigate('/customer/home');
    else if (role === 'staff') navigate('/staff/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col lg:flex-row">
      {/* LEFT SIDE: Brand Visual & Studio Showcase */}
      <div className="relative lg:w-1/2 min-h-[420px] lg:min-h-screen bg-gradient-to-br from-rose-950 via-burgundy-950 to-chocolate-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden text-white">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 text-chocolate-950 shadow-soft-lg">
            <Sparkles className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
              Dream Cake <span className="text-gold-400">AI</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-rose-200/80 font-semibold">
              Artisan Pastry Studio
            </p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-gold-300 border border-white/15 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            AI-Assisted Custom Cake Design Platform
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-cream-50">
            Design Your <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-200 to-gold-300 bg-clip-text text-transparent">
              Dream Cake.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-normal">
            Tell us what you imagine. Our AI stylist assists you with bespoke flavor pairings, structured reference analysis, and live 3D visual concepts fulfilled by master pastry chefs.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            {[
              'Design exactly what you imagine with 14-step custom controls',
              'Get real-time AI suggestions for flavors, frostings, and palettes',
              'Analyze reference photos & preview your cake before ordering',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/30 text-gold-300 border border-gold-400/40">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-cream-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bakery Assurance */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-rose-200/80">
          <span>✨ 100% Fresh Artisan Ingredients</span>
          <span>🎂 Master Chef Handcrafted</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Card Container */}
          <div className="rounded-3xl bg-white border border-cream-200/90 p-6 sm:p-8 shadow-soft-xl">
            {/* Tabs */}
            <div className="flex rounded-xl bg-cream-100 p-1 border border-cream-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setFormError(null);
                  clearError();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  tab === 'login'
                    ? 'bg-white text-chocolate-950 shadow-xs'
                    : 'text-chocolate-600 hover:text-chocolate-950'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setFormError(null);
                  clearError();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  tab === 'signup'
                    ? 'bg-white text-chocolate-950 shadow-xs'
                    : 'text-chocolate-600 hover:text-chocolate-950'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {(error || formError) && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                {error || formError}
              </div>
            )}

            {/* Login Form */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  startIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  startIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-chocolate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-rose-600 focus:ring-rose-400" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For demo, use default password or 1-click demo buttons below.'); }} className="font-semibold text-rose-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Sign In & Enter Studio
                </Button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-3.5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  startIcon={<User className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  startIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  startIcon={<Phone className="h-4 w-4" />}
                />

                <Input
                  label="Create Password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  startIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  startIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <label className="flex items-start gap-2 text-xs text-chocolate-600 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-400"
                  />
                  <span>
                    I agree to the <span className="font-semibold text-rose-700">Terms of Service</span> & <span className="font-semibold text-rose-700">Privacy Policy</span>.
                  </span>
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create Account & Design Cake
                </Button>
              </form>
            )}

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-6 pt-5 border-t border-cream-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-400 block text-center mb-2.5">
                Instant 1-Click Demo Accounts
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 transition-colors font-medium text-center"
                >
                  <User className="h-4 w-4 text-emerald-700 mb-1" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-900 hover:bg-rose-100 transition-colors font-medium text-center"
                >
                  <ChefHat className="h-4 w-4 text-rose-700 mb-1" />
                  <span>Bakery Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 text-purple-900 hover:bg-purple-100 transition-colors font-medium text-center"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-700 mb-1" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
