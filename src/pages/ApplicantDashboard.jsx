import React from 'react';
import { CreditScoreGauge } from '../components/CreditScoreGauge';
import { 
  ShieldCheckIcon, 
  TrendingUpIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  EyeIcon, 
  RupeeIcon, 
  ArrowRightIcon, 
  FileTextIcon,
  AlertTriangleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon
} from '../components/Icons';
import { calculateCreditDecision } from '../utils/creditEngine';

export function ApplicantDashboard({ user, applicationsList = [], onApplyNew, onViewOffer, onViewDecision, onDeleteApplication }) {
  // Defensive checks for user email
  const userEmail = (user && user.email) ? user.email.toLowerCase() : '';

  // Filter applications belonging ONLY to the logged-in applicant
  const myApplications = (applicationsList || []).filter(
    app => app && app.email && app.email.toLowerCase() === userEmail
  );

  const hasApplications = myApplications.length > 0;
  const latestApp = hasApplications ? myApplications[0] : null;
  const decisionResult = latestApp ? calculateCreditDecision(latestApp) : null;

  const appStatus = latestApp ? latestApp.status : 'No Applications';
  const isPending = appStatus === 'VERIFICATION PENDING' || appStatus === 'Pending Review' || appStatus === 'UNDER REVIEW' || appStatus === 'UNDER CREDIT REVIEW' || appStatus === 'Documents Under Review';
  const isApproved = appStatus === 'Approved' || appStatus === 'APPROVED' || appStatus === 'Offer Available';
  const isOfferAccepted = appStatus === 'Offer Accepted';
  const isRejected = appStatus === 'Rejected' || appStatus === 'REJECTED';

  const uploadedDocsCount = latestApp?.documents 
    ? Object.values(latestApp.documents).filter(d => d && d.status !== 'Not Uploaded').length 
    : 5;

  const userName = (user && user.fullName) ? user.fullName.split(' ')[0] : 'Applicant';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. TOP WELCOME HEADER */}
      <div className="fin-card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '24px 28px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Applicant Financial Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Welcome, {userName} 👋
          </h1>
          {!hasApplications && (
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
              You haven't submitted a loan application yet. Click below to apply.
            </p>
          )}
        </div>

        <button onClick={onApplyNew} className="btn btn-emerald pulse-emerald">
          <PlusIcon size={18} />
          <span>+ Apply for New Loan</span>
        </button>
      </div>

      {/* 2. STATUS BANNERS (For Users With Active Applications) */}
      {hasApplications && isPending && latestApp && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#f59e0b', color: '#fff', padding: '10px', borderRadius: '50%' }}>
              <ClockIcon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#92400e' }}>
                Application Status: {appStatus} ({latestApp.id})
              </div>
              <div style={{ fontSize: '0.875rem', color: '#b45309', marginTop: '2px' }}>
                Your application and supporting documents ({uploadedDocsCount} / 5 Uploaded) are under bank review.
              </div>
            </div>
          </div>
          <span className="badge badge-review" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            {appStatus}
          </span>
        </div>
      )}

      {hasApplications && isApproved && latestApp && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '20px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#059669', color: '#fff', padding: '10px', borderRadius: '50%' }}>
              <CheckCircleIcon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#047857' }}>
                🎉 Loan Application Approved
              </div>
              <div style={{ fontSize: '0.875rem', color: '#065f46', marginTop: '2px' }}>
                Approved Amount: <strong>₹{Number(latestApp.approvedAmount || latestApp.requestedAmount || 50000).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
          <button onClick={() => onViewOffer && onViewOffer(latestApp)} className="btn btn-emerald">
            <span>View Loan Offer</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      )}

      {hasApplications && isOfferAccepted && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '18px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircleIcon size={24} color="#059669" />
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#047857' }}>
              Loan Offer Accepted Successfully ✓
            </div>
          </div>
          <span className="badge badge-approved">Offer Accepted</span>
        </div>
      )}

      {hasApplications && isRejected && latestApp && (
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <XCircleIcon size={24} color="#e11d48" />
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#9f1239' }}>
              Loan Application Rejected
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#881337', marginTop: '4px' }}>
            Reason: <strong>{latestApp.rejectionReason || 'Document verification failed or high debt burden'}</strong>
          </div>
        </div>
      )}

      {/* 3. SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Credit Score */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Credit Score
          </div>
          <div style={{ fontSize: hasApplications ? '2.25rem' : '1.35rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
            {hasApplications ? (
              <>
                {decisionResult?.creditScore} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>/ 900</span>
              </>
            ) : (
              'Not Available'
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
            {hasApplications ? 'Personal Score Rating' : 'Submit application to evaluate'}
          </div>
        </div>

        {/* Card 2: Risk Level */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Risk Level
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', lineHeight: 1, marginBottom: '6px' }}>
            {hasApplications ? decisionResult?.riskLevel : 'Not Assessed'}
          </div>
          <span className={`badge ${hasApplications ? decisionResult?.riskBadgeClass : 'badge-review'}`}>
            {hasApplications ? decisionResult?.riskLevel : 'Pending Data'}
          </span>
        </div>

        {/* Card 3: Requested Loan Amount */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Requested Loan Amount
          </div>
          <div style={{ fontSize: hasApplications ? '1.75rem' : '1.35rem', fontWeight: '800', color: hasApplications ? '#4f46e5' : '#64748b', lineHeight: 1 }}>
            {hasApplications 
              ? `₹${Number(latestApp?.requestedAmount || 0).toLocaleString('en-IN')}`
              : 'No Application'
            }
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
            {hasApplications ? `Preferred Tenure: ${latestApp?.tenure || 24} Months` : 'No active request'}
          </div>
        </div>

        {/* Card 4: Application Status */}
        <div className="fin-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Application Status
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {appStatus}
          </div>
          <span className={`badge ${!hasApplications ? 'badge-review' : isApproved || isOfferAccepted ? 'badge-approved' : isRejected ? 'badge-rejected' : 'badge-review'}`}>
            {appStatus}
          </span>
        </div>

      </div>

      {/* 4. KEY FINANCIAL METRICS */}
      <div className="fin-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          Key Financial Metrics
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '700' }}>Debt-to-Income (DTI) Ratio</div>
            <div style={{ fontSize: hasApplications ? '1.75rem' : '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
              {hasApplications ? (
                <>
                  {decisionResult?.metrics?.dtiRatio} <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '700' }}>— Low Burden</span>
                </>
              ) : (
                'Not Available'
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Monthly Debt vs Monthly Income
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '700' }}>Payment Consistency</div>
            <div style={{ fontSize: hasApplications ? '1.75rem' : '1.25rem', fontWeight: '800', color: hasApplications ? '#059669' : '#0f172a', marginTop: '4px' }}>
              {hasApplications ? (
                <>
                  {decisionResult?.metrics?.paymentConsistency} <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '700' }}>— Excellent</span>
                </>
              ) : (
                'Not Available'
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Utility & Telecom Regular Payment Record
            </div>
          </div>

        </div>
      </div>

      {/* 5. WHY WAS THIS DECISION MADE? / DECISION SECTION */}
      <div className="fin-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          {hasApplications ? 'Why Was This Decision Made?' : 'No Credit Decision Yet'}
        </h3>

        {!hasApplications ? (
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '32px 24px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Submit a loan application to receive your financial assessment and credit decision.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Our automated system will analyze your income, cash flow, utility payment history, and debt burden.
            </div>
            <button onClick={onApplyNew} className="btn btn-primary">
              <PlusIcon size={16} />
              <span>Apply for New Loan</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '18px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#166534', marginBottom: '10px', textTransform: 'uppercase' }}>
                ✓ Positive Factors
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(decisionResult?.positiveFactors && decisionResult.positiveFactors.length > 0 ? decisionResult.positiveFactors : ['Stable monthly income', 'Low debt burden', 'Consistent payment history', 'Healthy bank activity', 'Good repayment capacity']).map((factor, idx) => (
                  <div key={idx} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#14532d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#059669', fontWeight: '800' }}>✓</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: isRejected ? '#fff1f2' : '#fffbeb', border: `1px solid ${isRejected ? '#fecdd3' : '#fef3c7'}`, padding: '18px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: isRejected ? '#9f1239' : '#92400e', marginBottom: '10px', textTransform: 'uppercase' }}>
                ⚠ Risk & Attention Areas
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(latestApp?.negativeFactors && latestApp.negativeFactors.length > 0 
                  ? latestApp.negativeFactors 
                  : decisionResult?.negativeFactors && decisionResult.negativeFactors.length > 0 
                  ? decisionResult.negativeFactors 
                  : ['Pending final admin review']).map((factor, idx) => (
                  <div key={idx} style={{ fontSize: '0.875rem', fontWeight: '600', color: isRejected ? '#881337' : '#78350f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: isRejected ? '#e11d48' : '#d97706', fontWeight: '800' }}>•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 6. MY APPLICATIONS TABLE */}
      <div className="fin-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
            My Applications
          </h3>
          <button onClick={onApplyNew} className="btn btn-sm btn-primary">
            + Apply for New Loan
          </button>
        </div>

        {myApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              No loan applications found yet.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Submit your first application to evaluate your credit eligibility.
            </div>
            <button onClick={onApplyNew} className="btn btn-sm btn-primary">
              + Apply for New Loan
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Application ID</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Risk</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {myApplications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 10px', fontWeight: '700', color: '#4f46e5', fontFamily: 'var(--font-mono)' }}>
                      {app.id}
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: '700', color: '#0f172a', textAlign: 'right' }}>
                      ₹{Number(app.requestedAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>
                      {app.creditScore || 742}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className={`badge ${app.riskLevel === 'Low Risk' ? 'badge-low-risk' : app.riskLevel === 'High Risk' ? 'badge-high-risk' : 'badge-medium-risk'}`}>
                        {app.riskLevel || 'Medium Risk'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className={`badge ${app.status === 'Approved' || app.status === 'APPROVED' || app.status === 'Offer Accepted' ? 'badge-approved' : app.status === 'Rejected' || app.status === 'REJECTED' ? 'badge-rejected' : 'badge-review'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onViewDecision && onViewDecision(app)}
                          className="btn btn-sm btn-secondary"
                        >
                          <EyeIcon size={14} /> View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete application ${app.id}?`)) {
                              if (onDeleteApplication) onDeleteApplication(app.id);
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
        )}
      </div>

    </div>
  );
}
