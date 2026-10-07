import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  MailIcon, 
  LockIcon, 
  UserIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  ZapIcon
} from '../components/Icons';
import AeroShards from '../components/AeroShards';

export function AuthPage({ 
  onLoginSuccess, 
  onRegisterUser, 
  registeredUsers = [], 
  initialRole = 'applicant', 
  initialMode = 'login' 
}) {
  const [role, setRole] = useState(initialRole); // 'applicant' or 'admin'
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Applicant Login Form State
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPassword, setApplicantPassword] = useState('');

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmpId, setRegEmpId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [successBanner, setSuccessBanner] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Auto-Fill Demo Credentials
  const handleAutoFillDemo = () => {
    setErrors({});
    if (role === 'admin') {
      setAdminEmail('admin@smartcredit.in');
      setAdminPassword('admin123');
    } else {
      setApplicantEmail('charan@example.com');
      setApplicantPassword('password123');
    }
  };

  // Handle Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessBanner('');
    const newErrors = {};

    if (role === 'admin') {
      const cleanAdminEmail = adminEmail.trim().toLowerCase();
      if (!cleanAdminEmail || !cleanAdminEmail.includes('@')) {
        newErrors.email = 'Please enter a valid bank officer email address';
      }
      if (!adminPassword || adminPassword.length < 4) {
        newErrors.password = 'Password must be at least 4 characters';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const matchedAdmin = (registeredUsers || []).find(u => u.role === 'admin' && u.email.toLowerCase() === cleanAdminEmail);
      if (matchedAdmin) {
        if (matchedAdmin.password && matchedAdmin.password !== adminPassword) {
          setErrors({ password: 'Incorrect admin password. Please try again.' });
          return;
        }
        onLoginSuccess(matchedAdmin);
      } else if (cleanAdminEmail === 'admin@smartcredit.in' && adminPassword === 'admin123') {
        onLoginSuccess({
          fullName: 'Officer Vikram Mehta',
          email: 'admin@smartcredit.in',
          role: 'admin'
        });
      } else {
        setErrors({ email: 'No bank admin account found with these credentials.' });
      }
    } else {
      const cleanEmail = applicantEmail.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!applicantPassword || applicantPassword.length < 4) {
        newErrors.password = 'Password must be at least 4 characters';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const matchedUser = (registeredUsers || []).find(u => u.email.toLowerCase() === cleanEmail);

      if (!matchedUser) {
        setErrors({ email: 'No account found with this email address. Please register first.' });
        return;
      }

      if (matchedUser.password && matchedUser.password !== applicantPassword) {
        setErrors({ password: 'Incorrect password. Please try again.' });
        return;
      }

      onLoginSuccess(matchedUser);
    }
  };

  // Handle Register Submission (No Mobile Number field required)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessBanner('');
    const newErrors = {};

    const cleanRegEmail = regEmail.trim().toLowerCase();

    if (!regFullName.trim()) newErrors.regFullName = 'Full name is required';
    if (!cleanRegEmail || !cleanRegEmail.includes('@')) {
      newErrors.regEmail = 'Valid email address is required';
    } else {
      const existingUser = (registeredUsers || []).find(u => u.email.toLowerCase() === cleanRegEmail);
      if (existingUser) {
        newErrors.regEmail = 'An account with this email address already exists. Please log in instead.';
      }
    }

    if (role === 'admin' && !regEmpId.trim()) {
      newErrors.regEmpId = 'Bank Employee ID is required';
    }
    if (!regPassword || regPassword.length < 4) {
      newErrors.regPassword = 'Password must be at least 4 characters';
    }
    if (regPassword !== regConfirmPassword) {
      newErrors.regConfirmPassword = 'Password and Confirm Password do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: role === 'admin' ? 'admin' : 'applicant'
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }

    setSuccessBanner(`Registration successful! Account created for ${newUser.fullName}. Please sign in with your email and password.`);
    if (role === 'admin') {
      setAdminEmail(newUser.email);
    } else {
      setApplicantEmail(newUser.email);
    }
    setMode('login');
    setRegFullName('');
    setRegEmail('');
    setRegEmpId('');
    setRegPassword('');
    setRegConfirmPassword('');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#020617',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* AeroShards Background Only for Login Page */}
      <AeroShards
        backgroundColor="#120F17"
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        flow="stream"
        material="pearl"
        detail="balanced"
        effect="none"
        scale={1}
        spread={1}
        depth={1}
        speed={1}
        spin={1}
        interaction="repel"
        density={1.5}
        shardSize={1.1}
        stretch={1}
        turbulence={1}
        glow={1}
        edgeSoftness={2}
        bloom={0.5}
        grain={0.05}
        chromaticAberration={0.0075}
        transitionDuration={1}
        interactionRadius={1.5}
        interactionStrength={0.5}
        rippleIntensity={1}
        holdToGather
        paused={false}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1080px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        
        {/* Left Branding Column */}
        <div style={{ paddingRight: '12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '24px' }}>
            <ShieldCheckIcon size={18} color="#10b981" />
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#34d399', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Smart Credit Assessment for Thin-File Borrowers
            </span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', lineHeight: 1.15, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '16px' }}>
            {role === 'admin' ? 'Bank Officer Admin Portal' : 'Applicant Loan Portal'} <br />
            <span style={{ background: role === 'admin' ? 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #34d399 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {mode === 'login' ? 'Secure Login' : 'Account Registration'}
            </span>
          </h1>

          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '32px' }}>
            {role === 'admin' 
              ? 'Bank Officer portal for reviewing applicant loan requests, calculating credit decisions, and issuing loan approvals or rejections.'
              : 'Applicant portal for submitting loan requests, evaluating alternative credit signals, and tracking real-time status.'
            }
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px', color: '#34d399' }}>
                <CheckCircleIcon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Alternative Financial Scoring</div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Incorporates utility payments and cash flow signals alongside traditional metrics.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px', color: '#34d399' }}>
                <CheckCircleIcon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Transparent Credit Decisions</div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Comprehensive positive and risk factor breakdowns for every evaluation.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="fin-glass-dark animate-fade-in" style={{ padding: '32px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          
          {/* STEP 1: SEPARATE PORTAL SELECTION (APPLICANT vs ADMIN) */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Select Portal Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '16px' }}>
              <button
                type="button"
                onClick={() => { setRole('applicant'); setErrors({}); }}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: role === 'applicant' ? '#059669' : 'transparent',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: role === 'applicant' ? '0 4px 14px rgba(5, 150, 105, 0.4)' : 'none'
                }}
              >
                <UserIcon size={18} />
                <span>Applicant Portal</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('admin'); setErrors({}); }}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: role === 'admin' ? '#4f46e5' : 'transparent',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: role === 'admin' ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none'
                }}
              >
                <ShieldCheckIcon size={18} />
                <span>Bank Admin Portal</span>
              </button>
            </div>
          </div>

          {/* STEP 2: MODE TOGGLE (LOGIN vs REGISTER) */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              {role === 'admin' ? 'Admin Login' : 'Applicant Login'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              {role === 'admin' ? 'Register New Admin' : 'Register New Applicant'}
            </button>
          </div>

          {/* DEMO CREDENTIALS BANNER AT TOP */}
          <div style={{
            background: role === 'admin' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(5, 150, 105, 0.15)',
            border: role === 'admin' ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '800', color: role === 'admin' ? '#a5b4fc' : '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🔑 Demo Credentials ({role === 'admin' ? 'Bank Admin' : 'Applicant'})
              </span>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  style={{
                    background: role === 'admin' ? '#4f46e5' : '#059669',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ZapIcon size={12} />
                  <span>Auto-Fill Credentials</span>
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.825rem', color: '#e2e8f0' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Email: </span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{role === 'admin' ? 'admin@smartcredit.in' : 'charan@example.com'}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Password: </span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{role === 'admin' ? 'admin123' : 'password123'}</strong>
              </div>
            </div>
          </div>

          {/* SUCCESS BANNER ALERT */}
          {successBanner && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '12px 16px',
              borderRadius: '12px',
              color: '#047857',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircleIcon size={18} color="#059669" />
              <span>{successBanner}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM (NO PHONE NUMBER) */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  {role === 'admin' ? 'Bank Officer Email' : 'Applicant Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }}>
                    <MailIcon size={18} />
                  </span>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', borderColor: errors.email ? '#f43f5e' : 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder={role === 'admin' ? 'admin@smartcredit.in' : 'charan@example.com'}
                    value={role === 'admin' ? adminEmail : applicantEmail}
                    onChange={(e) => role === 'admin' ? setAdminEmail(e.target.value) : setApplicantEmail(e.target.value)}
                  />
                </div>
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  {role === 'admin' ? 'Officer Password / Passcode' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }}>
                    <LockIcon size={18} />
                  </span>
                  <input
                    type="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', borderColor: errors.password ? '#f43f5e' : 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder="••••••••"
                    value={role === 'admin' ? adminPassword : applicantPassword}
                    onChange={(e) => role === 'admin' ? setAdminPassword(e.target.value) : setApplicantPassword(e.target.value)}
                  />
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <label className="custom-checkbox" style={{ color: '#cbd5e1' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-emerald'} btn-lg`}
                style={{ width: '100%', marginBottom: '16px' }}
              >
                <span>Login to {role === 'admin' ? 'Bank Admin Portal' : 'Applicant Portal'}</span>
                <ArrowRightIcon size={18} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
                Need a new account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: '700', cursor: 'pointer' }}
                >
                  Register {role === 'admin' ? 'Officer Account' : 'Applicant Account'}
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM (NO PHONE NUMBER FIELD) */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  {role === 'admin' ? 'Officer Full Name' : 'Applicant Full Name'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }}>
                    <UserIcon size={18} />
                  </span>
                  <input
                    type="text"
                    className={`form-input ${errors.regFullName ? 'error' : ''}`}
                    style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder={role === 'admin' ? 'e.g. Vikram Mehta' : 'e.g. Charan'}
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                  />
                </div>
                {errors.regFullName && <div className="form-error">{errors.regFullName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>
                  {role === 'admin' ? 'Bank Email Address' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }}>
                    <MailIcon size={18} />
                  </span>
                  <input
                    type="email"
                    className={`form-input ${errors.regEmail ? 'error' : ''}`}
                    style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder={role === 'admin' ? 'officer@smartcredit.in' : 'charan@example.com'}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                {errors.regEmail && <div className="form-error">{errors.regEmail}</div>}
              </div>

              {role === 'admin' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Employee ID / Officer Code</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }}>
                      <LockIcon size={18} />
                    </span>
                    <input
                      type="text"
                      className={`form-input ${errors.regEmpId ? 'error' : ''}`}
                      style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                      placeholder="e.g. EMP-9942"
                      value={regEmpId}
                      onChange={(e) => setRegEmpId(e.target.value)}
                    />
                  </div>
                  {errors.regEmpId && <div className="form-error">{errors.regEmpId}</div>}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
                  <input
                    type="password"
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  {errors.regPassword && <div className="form-error">{errors.regPassword}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                  {errors.regConfirmPassword && <div className="form-error">{errors.regConfirmPassword}</div>}
                </div>
              </div>

              <button
                type="submit"
                className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-emerald'} btn-lg`}
                style={{ width: '100%', marginBottom: '16px' }}
              >
                <span>Register {role === 'admin' ? 'Bank Officer Account' : 'Applicant Account'}</span>
                <ArrowRightIcon size={18} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: '700', cursor: 'pointer' }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="fin-card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Reset Password ({role === 'admin' ? 'Bank Admin' : 'Applicant'})
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
              Enter your registered email address and we'll send you password recovery instructions.
            </p>

            {forgotSuccess ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', color: '#047857', fontSize: '0.9rem', marginBottom: '20px' }}>
                ✓ Reset link has been sent to <strong>{forgotEmail}</strong>. Please check your inbox.
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder={role === 'admin' ? 'admin@smartcredit.in' : 'charan@example.com'}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (forgotEmail) setForgotSuccess(true);
                  }}
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
