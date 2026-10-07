import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthPage } from './pages/AuthPage';
import { ApplicantDashboard } from './pages/ApplicantDashboard';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { LoanApplicationPage } from './pages/LoanApplicationPage';
import { CreditDecisionPage } from './pages/CreditDecisionPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import Aurora from './components/Aurora';

import { INITIAL_USER, INITIAL_APPLICATIONS, SAMPLE_NOTIFICATIONS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('auth'); // 'auth', 'dashboard', 'my-applications', 'apply', 'profile', 'decision', 'admin'

  // Registered Users Storage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_credit_registered_users');
      return saved ? JSON.parse(saved) : [
        {
          fullName: 'Charan',
          email: 'charan@example.com',
          phone: '+91 98765 12345',
          password: 'password123',
          role: 'applicant'
        }
      ];
    } catch (e) {
      return [
        {
          fullName: 'Charan',
          email: 'charan@example.com',
          phone: '+91 98765 12345',
          password: 'password123',
          role: 'applicant'
        }
      ];
    }
  });

  const handleRegisterUser = (newUser) => {
    setRegisteredUsers(prev => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem('smart_credit_registered_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Application Data State for form
  const [applicationFormData, setApplicationFormData] = useState({
    fullName: INITIAL_USER.fullName,
    age: 26,
    employmentType: INITIAL_USER.employmentType,
    occupation: INITIAL_USER.occupation,
    phone: INITIAL_USER.phone,
    email: INITIAL_USER.email,
    monthlyIncome: 55000,
    otherIncome: 5000,
    monthlyExpenses: 22000,
    monthlyRent: 10000,
    utilityPayments: 2500,
    telecomPayments: 1000,
    cashFlow: 35000,
    existingLoanAmount: 25000,
    existingEmi: 5000,
    requestedAmount: 50000,
    tenure: 24
  });

  // Global Applications List (Persisted in localStorage)
  const [applicationsList, setApplicationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_credit_applications_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(item => item && item.id);
          return valid.length > 0 ? valid : INITIAL_APPLICATIONS;
        }
      }
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  // Sync applications list changes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('smart_credit_applications_list', JSON.stringify(applicationsList));
    } catch (e) {}
  }, [applicationsList]);

  // Active selected application for viewing details or offer
  const [activeRecord, setActiveRecord] = useState(INITIAL_APPLICATIONS[0]);

  // Notifications State
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handle Login
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setIsLoggedIn(true);
    setApplicationFormData(prev => ({
      ...prev,
      fullName: userObj.fullName,
      email: userObj.email,
      phone: userObj.phone || prev.phone
    }));
    setActivePage(userObj.role === 'admin' ? 'admin' : 'dashboard');
  };

  const [authPortalRole, setAuthPortalRole] = useState('applicant');

  // Handle Switching Portals (Prompts login for target role)
  const handleSwitchPortal = (targetRole) => {
    setAuthPortalRole(targetRole);
    setIsLoggedIn(false);
    setActivePage('auth');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActivePage('auth');
  };

  // Handle Applicant Submit Loan Request
  const handleSubmitApplication = (formData) => {
    const newId = `CR${Math.floor(7000 + Math.random() * 2000)}`;
    const appEmail = (formData.email || currentUser?.email || '').trim();
    const appName = (formData.fullName || currentUser?.fullName || 'Applicant').trim();

    const newAppRecord = {
      id: newId,
      applicantName: appName,
      email: appEmail,
      phone: formData.phone || currentUser?.phone || '+91 98765 12345',
      age: Number(formData.age) || 26,
      employmentType: formData.employmentType || currentUser?.employmentType || 'Salaried',
      occupation: formData.occupation || currentUser?.occupation || 'Software Developer',
      requestedAmount: Number(formData.requestedAmount) || 50000,
      approvedAmount: Number(formData.requestedAmount) || 50000,
      tenure: Number(formData.tenure) || 24,
      appliedDate: new Date().toISOString().split('T')[0],
      creditScore: 742,
      riskLevel: 'Medium Risk',
      status: 'Pending Review',
      monthlyIncome: Number(formData.monthlyIncome) || 55000,
      otherIncome: Number(formData.otherIncome) || 5000,
      monthlyExpenses: Number(formData.monthlyExpenses) || 22000,
      monthlyRent: Number(formData.monthlyRent) || 10000,
      utilityPayments: Number(formData.utilityPayments) || 2500,
      telecomPayments: Number(formData.telecomPayments) || 1000,
      cashFlow: Number(formData.cashFlow) || 35000,
      existingLoanAmount: Number(formData.existingLoanAmount) || 25000,
      existingEmi: Number(formData.existingEmi) || 5000,
      rejectionReason: '',
      rejectionComments: '',
      positiveFactors: [
        'Stable monthly income',
        'Low debt burden',
        'Consistent payment history',
        'Healthy bank activity',
        'Good repayment capacity'
      ],
      negativeFactors: [
        'Pending final admin review'
      ]
    };

    setApplicationsList(prev => [newAppRecord, ...prev]);
    setActiveRecord(newAppRecord);

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        applicantEmail: currentUser.email,
        title: 'Application Submitted',
        message: `Your application ${newId} has been submitted.`,
        time: 'Just now',
        read: false,
        type: 'info'
      },
      ...prev
    ]);

    return newAppRecord;
  };

  // Handle Accept Loan Offer
  const handleAcceptOffer = (appId) => {
    setApplicationsList(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: 'Offer Accepted' };
      }
      return app;
    }));

    if (activeRecord && activeRecord.id === appId) {
      setActiveRecord(prev => prev ? { ...prev, status: 'Offer Accepted' } : null);
    }
  };

  // Handle Delete Application
  const handleDeleteApplication = (appId) => {
    setApplicationsList(prev => prev.filter(app => app.id !== appId));
    if (activeRecord && activeRecord.id === appId) {
      setActiveRecord(null);
    }
  };

  // Applications belonging strictly to logged in applicant
  const currentUserEmail = currentUser?.email?.toLowerCase() || '';
  const userApplications = (applicationsList || []).filter(
    app => app && app.email && app.email.toLowerCase() === currentUserEmail
  );

  return (
    <div className="app-layout">
      {/* React Bits Aurora Animated Background */}
      <Aurora
        colorStops={["#7cff67", "#B497CF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
      {isLoggedIn && (
        <Navbar
          user={currentUser}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
          onSwitchPortal={handleSwitchPortal}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications.filter(n => !n.applicantEmail || (currentUser?.email && n.applicantEmail.toLowerCase() === currentUser.email.toLowerCase()))}
        setNotifications={setNotifications}
      />

      {/* Main Page Routing */}
      {!isLoggedIn || activePage === 'auth' ? (
        <AuthPage 
          initialRole={authPortalRole}
          initialMode="login"
          registeredUsers={registeredUsers}
          onRegisterUser={handleRegisterUser}
          onLoginSuccess={handleLoginSuccess} 
        />
      ) : (
        <main className="main-content">
          {activePage === 'dashboard' && (
            <ApplicantDashboard
              user={currentUser}
              applicationsList={applicationsList}
              onApplyNew={() => setActivePage('apply')}
              onDeleteApplication={handleDeleteApplication}
              onViewOffer={(appRecord) => {
                setActiveRecord(appRecord);
                setActivePage('decision');
              }}
              onViewDecision={(appRecord) => {
                setActiveRecord(appRecord);
                setActivePage('decision');
              }}
            />
          )}

          {activePage === 'my-applications' && (
            <MyApplicationsPage
              userApplications={userApplications}
              onApplyNew={() => setActivePage('apply')}
              onDeleteApplication={handleDeleteApplication}
              onViewDecision={(appRecord) => {
                setActiveRecord(appRecord);
                setActivePage('decision');
              }}
            />
          )}

          {activePage === 'apply' && (
            <LoanApplicationPage
              user={currentUser}
              formData={applicationFormData}
              setFormData={setApplicationFormData}
              onSubmitApplication={handleSubmitApplication}
              onBackToDashboard={() => setActivePage('dashboard')}
              onViewApplication={(appRecord) => {
                setActiveRecord(appRecord);
                setActivePage('decision');
              }}
            />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              user={currentUser}
              onLogout={handleLogout}
            />
          )}

          {activePage === 'decision' && (
            <CreditDecisionPage
              applicationRecord={activeRecord}
              onAcceptOffer={handleAcceptOffer}
              onBackToDashboard={() => setActivePage('dashboard')}
            />
          )}

          {activePage === 'admin' && (
            <AdminDashboard
              applicationsList={applicationsList}
              setApplicationsList={setApplicationsList}
              onDeleteApplication={handleDeleteApplication}
            />
          )}
        </main>
      )}

      {/* Footer */}
      {isLoggedIn && (
        <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 20px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          Smart Credit Assessment for Thin-File Borrowers • FSD Training Project Prototype • Applicant & Admin Review Workflow
        </footer>
      )}
    </div>
  );
}
