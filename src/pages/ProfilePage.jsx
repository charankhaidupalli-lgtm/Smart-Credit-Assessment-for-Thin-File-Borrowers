import React, { useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon, ShieldCheckIcon, LogOutIcon, CheckCircleIcon } from '../components/Icons';

export function ProfilePage({ user, onLogout }) {
  const [toastMessage, setToastMessage] = useState('');

  const handleAction = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 99
        }}>
          <CheckCircleIcon size={20} color="#34d399" />
          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="fin-card" style={{ padding: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            border: '3px solid #ffffff',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}>
            {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
          </div>

          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
              {user.fullName || 'Charan'}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '2px' }}>
              {user.email || 'charan@example.com'}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span className="badge badge-approved">
                Verified Applicant Account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="fin-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
          My Profile Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Full Name:</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.fullName || 'Charan'}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Email Address:</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.email || 'charan@example.com'}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Phone Number:</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.phone || '+91 98765 12345'}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Employment Type:</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.employmentType || 'Salaried'}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Occupation:</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.occupation || 'Software Developer'}</strong>
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button onClick={() => handleAction('Profile edit mode enabled.')} className="btn btn-secondary">
            Edit Profile
          </button>
          
          <button onClick={() => handleAction('Password reset link sent to email.')} className="btn btn-secondary">
            Change Password
          </button>

          <button onClick={onLogout} className="btn btn-danger" style={{ marginLeft: 'auto' }}>
            <LogOutIcon size={16} /> Logout
          </button>
        </div>

      </div>

    </div>
  );
}
