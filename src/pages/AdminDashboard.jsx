import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  SearchIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  RupeeIcon,
  TrendingUpIcon,
  FileTextIcon,
  UserIcon,
  TrashIcon
} from '../components/Icons';
import { calculateCreditDecision } from '../utils/creditEngine';

export function AdminDashboard({ applicationsList, setApplicationsList, onDeleteApplication }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvedAmountInput, setApprovedAmountInput] = useState(100000);

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('High existing debt');
  const [rejectionComments, setRejectionComments] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  // Top summary metric computations
  const totalApps = applicationsList.length;
  const pendingCount = applicationsList.filter(a => a.status === 'Pending Review' || a.status === 'UNDER REVIEW').length;
  const approvedCount = applicationsList.filter(a => a.status === 'Approved' || a.status === 'APPROVED' || a.status === 'Offer Accepted').length;
  const rejectedCount = applicationsList.filter(a => a.status === 'Rejected' || a.status === 'REJECTED').length;

  // Filtered Applications Queue
  const filteredApps = (applicationsList || []).filter(app => {
    if (!app) return false;
    const applicantName = app.applicantName || '';
    const id = app.id || '';
    const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CONFIRM APPROVAL ACTION
  const handleConfirmApproval = () => {
    if (!selectedApp) return;

    setApplicationsList(prev => prev.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: 'Approved',
          approvedAmount: Number(approvedAmountInput),
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    }));

    setSelectedApp(prev => prev ? { ...prev, status: 'Approved', approvedAmount: Number(approvedAmountInput) } : null);
    setShowApproveModal(false);
    
    setToastMessage(`Application ${selectedApp.id} approved for ₹${Number(approvedAmountInput).toLocaleString('en-IN')}`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // CONFIRM REJECTION ACTION
  const handleConfirmRejection = () => {
    if (!selectedApp) return;

    setApplicationsList(prev => prev.map(app => {
      if (app.id === selectedApp.id) {
        return {
          ...app,
          status: 'Rejected',
          rejectionReason,
          rejectionComments
        };
      }
      return app;
    }));

    setSelectedApp(prev => prev ? { ...prev, status: 'Rejected', rejectionReason, rejectionComments } : null);
    setShowRejectModal(false);

    setToastMessage(`Application ${selectedApp.id} rejected. Reason recorded.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const currentDecision = selectedApp ? calculateCreditDecision(selectedApp) : null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
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

      {/* Admin Header Banner */}
      <div className="fin-card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        padding: '24px 28px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Bank Officer Underwriting Console
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Loan Review Dashboard
          </h1>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700' }}>
          Role: Loan Officer / Underwriter
        </div>
      </div>

      {/* TOP 4 SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        {/* Total Applications */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Applications</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{totalApps}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>All Loan Requests</div>
        </div>

        {/* Pending Review */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Pending Review</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '4px', fontWeight: '600' }}>Requires Officer Decision</div>
        </div>

        {/* Approved */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Approved</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>{approvedCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>Underwriting Sanctioned</div>
        </div>

        {/* Rejected */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Rejected</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#e11d48', marginTop: '4px' }}>{rejectedCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#e11d48', marginTop: '4px', fontWeight: '600' }}>Declined Requests</div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="fin-card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}>
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by Applicant Name or Application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="fin-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          Applications Review Queue ({filteredApps.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Applicant</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Application ID</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Requested Amount</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Credit Score</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Risk Level</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 10px', fontWeight: '700', color: '#0f172a' }}>
                    {app.applicantName}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: '700', color: '#4f46e5', fontFamily: 'var(--font-mono)' }}>
                    {app.id}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: '700', color: '#0f172a' }}>
                    ₹{Number(app.requestedAmount).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: '800', color: '#0f172a' }}>
                    {app.creditScore}
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <span className={`badge ${app.riskLevel === 'Low Risk' ? 'badge-low-risk' : app.riskLevel === 'High Risk' ? 'badge-high-risk' : 'badge-medium-risk'}`}>
                      {app.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <span className={`badge ${app.status === 'Approved' || app.status === 'APPROVED' ? 'badge-approved' : app.status === 'Rejected' || app.status === 'REJECTED' ? 'badge-rejected' : 'badge-review'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setApprovedAmountInput(app.requestedAmount);
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        <EyeIcon size={14} /> View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete application ${app.id}?`)) {
                            if (onDeleteApplication) {
                              onDeleteApplication(app.id);
                            } else {
                              setApplicationsList(prev => prev.filter(a => a.id !== app.id));
                            }
                            if (selectedApp && selectedApp.id === app.id) setSelectedApp(null);
                            setToastMessage(`Application ${app.id} deleted successfully.`);
                            setTimeout(() => setToastMessage(''), 3000);
                          }
                        }}
                        className="btn btn-sm"
                        style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', padding: '6px 10px' }}
                        title="Delete Application"
                      >
                        <TrashIcon size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN APPLICATION DETAILS MODAL */}
      {selectedApp && currentDecision && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="fin-card animate-fade-in" style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span className={`badge ${selectedApp.status === 'Approved' ? 'badge-approved' : selectedApp.status === 'Rejected' ? 'badge-rejected' : 'badge-review'}`} style={{ marginBottom: '6px' }}>
                  Status: {selectedApp.status}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedApp.applicantName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                  Application ID: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{selectedApp.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: '#64748b', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Section 1: Personal Information */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                1. Personal Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>Name: <strong>{selectedApp.applicantName}</strong></div>
                <div>Age: <strong>{selectedApp.age || 29} Years</strong></div>
                <div>Employment: <strong>{selectedApp.employmentType || 'Salaried'}</strong></div>
                <div>Occupation: <strong>{selectedApp.occupation || 'Engineer'}</strong></div>
                <div>Phone: <strong>{selectedApp.phone || '+91 98765 43210'}</strong></div>
                <div>Email: <strong>{selectedApp.email || 'applicant@example.com'}</strong></div>
              </div>
            </div>

            {/* Section 2: Income Details */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                2. Income Details & Loan Request
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>Monthly Income: <strong style={{ color: '#059669' }}>₹{Number(selectedApp.monthlyIncome || 60000).toLocaleString('en-IN')}</strong></div>
                <div>Other Income: <strong>₹{Number(selectedApp.otherIncome || 0).toLocaleString('en-IN')}</strong></div>
                <div>Monthly Expenses: <strong>₹{Number(selectedApp.monthlyExpenses || 25000).toLocaleString('en-IN')}</strong></div>
                <div>Requested Amount: <strong style={{ color: '#4f46e5' }}>₹{Number(selectedApp.requestedAmount).toLocaleString('en-IN')}</strong></div>
                <div>Preferred Tenure: <strong>{selectedApp.tenure || 24} Months</strong></div>
              </div>
            </div>

            {/* Section 3. Alternative Financial Data */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                3. Alternative Financial Data
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>Monthly Rent: <strong>₹{Number(selectedApp.monthlyRent || 0).toLocaleString('en-IN')}</strong></div>
                <div>Utility Bills: <strong>₹{Number(selectedApp.utilityPayments || 2000).toLocaleString('en-IN')}</strong></div>
                <div>Telecom Bills: <strong>₹{Number(selectedApp.telecomPayments || 1000).toLocaleString('en-IN')}</strong></div>
                <div>Avg Bank Inflow: <strong style={{ color: '#059669' }}>₹{Number(selectedApp.cashFlow || 35000).toLocaleString('en-IN')}</strong></div>
                <div>Total Loan Debt: <strong>₹{Number(selectedApp.existingLoanAmount || 0).toLocaleString('en-IN')}</strong></div>
                <div>Existing Monthly EMI: <strong style={{ color: '#e11d48' }}>₹{Number(selectedApp.existingEmi || 0).toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            {/* Section 4: Document Verification Queue */}
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    📁 Document Verification Queue
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Cross-examine uploaded supporting documents against applicant's entered financial details.
                  </div>
                </div>
                <span className="badge badge-review" style={{ fontSize: '0.8rem' }}>
                  Uploaded ≠ Verified
                </span>
              </div>

              {/* 5 Documents Verification Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'identityProof', label: '1. Identity Proof', help: 'Verify Applicant Identity' },
                  { key: 'addressProof', label: '2. Address Proof', help: 'Verify Residential Address' },
                  { key: 'incomeProof', label: '3. Income Proof', help: `Verify Monthly Income (₹${Number(selectedApp.monthlyIncome || 0).toLocaleString('en-IN')})` },
                  { key: 'bankStatement', label: '4. Bank Statement', help: `Verify Inflow (₹${Number(selectedApp.cashFlow || 0).toLocaleString('en-IN')})` },
                  { key: 'existingLoanStatement', label: '5. Existing Loan Statement', help: `Verify Debt (₹${Number(selectedApp.existingLoanAmount || 0).toLocaleString('en-IN')})` }
                ].map((docItem) => {
                  const docData = (selectedApp.documents && selectedApp.documents[docItem.key]) || {
                    name: `${docItem.key}.pdf`,
                    status: 'Uploaded',
                    size: '1.4 MB'
                  };
                  const docStatus = docData.status || 'Uploaded';

                  return (
                    <div 
                      key={docItem.key}
                      style={{
                        background: docStatus === 'Verified' ? '#f0fdf4' : docStatus === 'Rejected' ? '#fff1f2' : docStatus === 'Needs More Information' ? '#fffbeb' : '#f8fafc',
                        border: `1px solid ${docStatus === 'Verified' ? '#a7f3d0' : docStatus === 'Rejected' ? '#fecdd3' : docStatus === 'Needs More Information' ? '#fef3c7' : '#e2e8f0'}`,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>
                          {docItem.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          📄 <strong>{docData.name || 'document.pdf'}</strong> ({docData.size || '1.2 MB'}) • {docItem.help}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${docStatus === 'Verified' ? 'badge-approved' : docStatus === 'Rejected' ? 'badge-rejected' : 'badge-review'}`} style={{ fontSize: '0.75rem' }}>
                          {docStatus}
                        </span>

                        {/* VIEW DOCUMENT BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            const defaultPdfMap = {
                              identityProof: '/documents/identity_proof.pdf',
                              addressProof: '/documents/address_proof.pdf',
                              incomeProof: '/documents/income_proof.pdf',
                              bankStatement: '/documents/bank_statement.pdf',
                              existingLoanStatement: '/documents/existing_loan_statement.pdf'
                            };
                            const pdfUrl = docData.url || defaultPdfMap[docItem.key] || '/documents/identity_proof.pdf';
                            window.open(pdfUrl, '_blank');
                          }}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#818cf8', color: '#4f46e5' }}
                        >
                          👁 View Document
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = 'Verified';
                            const updatedDocs = {
                              ...(selectedApp.documents || {}),
                              [docItem.key]: { ...(docData), status: newStatus }
                            };
                            const updatedApp = { ...selectedApp, documents: updatedDocs };
                            setSelectedApp(updatedApp);
                            setApplicationsList(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
                          }}
                          className="btn btn-sm btn-emerald"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          ✓ Verify
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = 'Needs More Information';
                            const updatedDocs = {
                              ...(selectedApp.documents || {}),
                              [docItem.key]: { ...(docData), status: newStatus }
                            };
                            const updatedApp = { ...selectedApp, documents: updatedDocs, status: 'Needs More Information' };
                            setSelectedApp(updatedApp);
                            setApplicationsList(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
                          }}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#fffbeb', borderColor: '#fef3c7', color: '#b45309' }}
                        >
                          ⚠ Needs Info
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = 'Rejected';
                            const updatedDocs = {
                              ...(selectedApp.documents || {}),
                              [docItem.key]: { ...(docData), status: newStatus }
                            };
                            const updatedApp = { ...selectedApp, documents: updatedDocs };
                            setSelectedApp(updatedApp);
                            setApplicationsList(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
                          }}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#fff1f2', borderColor: '#fecdd3', color: '#e11d48' }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Credit Assessment */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                5. Credit Assessment
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                <div>Credit Score: <strong style={{ fontSize: '1.1rem' }}>{selectedApp.creditScore}</strong></div>
                <div>Risk Level: <strong>{selectedApp.riskLevel}</strong></div>
                <div>DTI Ratio: <strong>{currentDecision.metrics.dtiRatio}</strong></div>
                <div>Payment Consistency: <strong>{currentDecision.metrics.paymentConsistency}</strong></div>
                <div>Repayment Capacity: <strong style={{ color: '#059669' }}>₹{currentDecision.metrics.netDisposableIncome.toLocaleString('en-IN')}/mo</strong></div>
              </div>
            </div>

            {/* Section 5: Decision Explanation */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                5. Decision Rationale & Factors
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#14532d' }}>
                  <strong>Positive Factors:</strong>
                  <ul style={{ margin: '6px 0 0 16px' }}>
                    {currentDecision.positiveFactors.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                <div style={{ background: '#fff1f2', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#881337' }}>
                  <strong>Risk & Attention Areas:</strong>
                  <ul style={{ margin: '6px 0 0 16px' }}>
                    {(selectedApp.negativeFactors || currentDecision.negativeFactors).map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Rejection Reason Display if already rejected */}
            {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '16px', borderRadius: '12px', marginBottom: '20px', color: '#881337', fontSize: '0.875rem' }}>
                <strong>Rejection Reason Recorded:</strong> {selectedApp.rejectionReason}
                {selectedApp.rejectionComments && <div>Comments: {selectedApp.rejectionComments}</div>}
              </div>
            )}

            {/* ADMIN DECISION BUTTONS */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button
                onClick={() => setShowRejectModal(true)}
                className="btn btn-danger btn-lg"
              >
                <XCircleIcon size={18} />
                <span>Reject Application</span>
              </button>

              <button
                onClick={() => setShowApproveModal(true)}
                className="btn btn-emerald btn-lg"
              >
                <CheckCircleIcon size={18} />
                <span>Approve Application</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM APPROVAL MODAL */}
      {showApproveModal && selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="fin-card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Approve Loan Application?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
              Are you sure you want to approve this loan application for <strong>{selectedApp.applicantName}</strong>?
            </p>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Sanctioned Approved Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={approvedAmountInput}
                onChange={(e) => setApprovedAmountInput(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowApproveModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmApproval} className="btn btn-emerald">
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM REJECTION MODAL */}
      {showRejectModal && selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="fin-card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Reject Application
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
              Select a primary rejection reason. This will be displayed to the applicant.
            </p>

            <div className="form-group">
              <label className="form-label">Reason for Rejection</label>
              <select
                className="form-select"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              >
                <option value="High existing debt">High existing debt</option>
                <option value="Insufficient income">Insufficient income</option>
                <option value="High DTI ratio">High DTI ratio</option>
                <option value="Irregular payment history">Irregular payment history</option>
                <option value="Insufficient repayment capacity">Insufficient repayment capacity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Additional Comments (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Enter detailed notes explaining the rejection decision..."
                value={rejectionComments}
                onChange={(e) => setRejectionComments(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmRejection} className="btn btn-danger">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
