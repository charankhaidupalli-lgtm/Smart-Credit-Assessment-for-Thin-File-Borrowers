import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  ShieldCheckIcon, 
  LogOutIcon,
  UserIcon
} from './Icons';
import './PillNav.css';

/**
 * FREE React Bits Pill Nav Component with GSAP Animations
 * Adapted for Smart Credit Decisioning System
 */
export function PillNav({ 
  user, 
  activePage, 
  setActivePage, 
  onLogout,
  onSwitchPortal
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isApplicant = user ? user.role === 'applicant' : true;

  // Navigation Items Mapping
  const applicantNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-applications', label: 'My Applications' },
    { id: 'apply', label: 'Apply for Loan' },
    { id: 'profile', label: 'Profile' }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Bank Admin Queue' }
  ];

  const currentNavItems = isApplicant ? applicantNavItems : adminNavItems;

  // GSAP Pill Animation Refs
  const navContainerRef = useRef(null);
  const activeBgRef = useRef(null);
  const itemsRef = useRef({});

  // Animate Pill Active Background Indicator using GSAP
  const updatePillPosition = (targetId, immediate = false) => {
    const activeItemEl = itemsRef.current[targetId];
    const bgEl = activeBgRef.current;
    if (!activeItemEl || !bgEl) return;

    const left = activeItemEl.offsetLeft;
    const width = activeItemEl.offsetWidth;

    if (immediate) {
      gsap.set(bgEl, { left, width });
    } else {
      gsap.to(bgEl, {
        left,
        width,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  };

  useEffect(() => {
    updatePillPosition(activePage);
  }, [activePage, isApplicant]);

  useEffect(() => {
    const handleResize = () => updatePillPosition(activePage, true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activePage]);

  // Handle Mouse Hover Preview Animation with GSAP
  const handleItemMouseEnter = (id) => {
    updatePillPosition(id);
  };

  const handleContainerMouseLeave = () => {
    updatePillPosition(activePage);
  };

  return (
    <header className="pill-nav-header">
      <div className="pill-nav-inner">
        
        {/* Brand & Logo */}
        <div 
          className="pill-nav-brand"
          onClick={() => setActivePage(isApplicant ? 'dashboard' : 'admin')}
        >
          <div className="pill-nav-logo-icon">
            <ShieldCheckIcon size={24} />
          </div>
          <div>
            <div className="pill-nav-title">
              Smart Credit <span className="pill-nav-highlight">Assessment</span> for Thin-File Borrowers
            </div>
            <div className="pill-nav-subtitle">
              {isApplicant ? 'Applicant Financial Portal' : 'Bank Officer Admin Portal'}
            </div>
          </div>
        </div>

        {/* Center Desktop Pill Nav (React Bits FREE Pill Nav Component) */}
        <div className="pill-nav-desktop">
          <div 
            ref={navContainerRef}
            className="pill-nav-wrapper"
            onMouseLeave={handleContainerMouseLeave}
          >
            {/* Animated GSAP Active Pill Background */}
            <div ref={activeBgRef} className="pill-nav-active-bg" />

            {currentNavItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => (itemsRef.current[item.id] = el)}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                onMouseEnter={() => handleItemMouseEnter(item.id)}
                className={`pill-nav-item ${activePage === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Controls & User Avatar */}
        <div className="pill-nav-right">
          
          {/* Portal Switcher Button */}
          <button
            onClick={() => {
              const targetRole = isApplicant ? 'admin' : 'applicant';
              if (onSwitchPortal) {
                onSwitchPortal(targetRole);
              } else {
                setActivePage('auth');
              }
            }}
            className="pill-switch-btn"
            title="Switch portal view"
          >
            Switch to: <strong>{isApplicant ? 'Bank Admin' : 'Applicant'}</strong>
          </button>

          {/* User Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="pill-user-avatar"
              title="User profile settings"
            >
              {user && user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
            </button>

            {showProfileMenu && (
              <div className="pill-profile-dropdown">
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{user?.fullName || 'User'}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{user?.email || ''}</div>
                </div>

                <button
                  onClick={() => { setActivePage('profile'); setShowProfileMenu(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer', marginBottom: '6px' }}
                >
                  My Profile
                </button>

                <button
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#fff1f2',
                    border: '1px solid #ffe4e6',
                    color: '#e11d48',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOutIcon size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="pill-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className={`pill-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {currentNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: activePage === item.id ? '#ecfdf5' : '#f8fafc',
                color: activePage === item.id ? '#059669' : '#0f172a',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
