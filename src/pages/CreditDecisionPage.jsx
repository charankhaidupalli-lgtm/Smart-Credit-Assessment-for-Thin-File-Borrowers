import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  RupeeIcon, 
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon
} from '../components/Icons';
import { calculateCreditDecision } from '../utils/creditEngine';

export function CreditDecisionPage({ applicationRecord, onAcceptOffer, onBackToDashboard }) {
  const app = applicationRecord || {};
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(app.status === 'Offer Accepted');

  const decisionResult = calculateCreditDecision(app);

  const status = app.status || 'Pending Review';
  const isPending = status === 'Pending Review' || status === 'UNDER REVIEW';
  const isApproved = status === 'Approved' || status === 'APPROVED' || status === 'Offer Available';
  const isRejected = status === 'Rejected' || status === 'REJECTED';

  const approvedAmt = app.approvedAmount !== undefined ? app.approvedAmount : (app.requestedAmount || 50000);
  const requestedAmt = app.requestedAmount || approvedAmt || 50000;

  const handleConfirmAccept = () => {
    if (onAcceptOffer && app.id) {
      onAcceptOffer(app.id);
    }
    setOfferAccepted(true);
    setShowAcceptModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. APPROVED WORKFLOW / LOAN OFFER PAGE */}
      {(isApproved || offerAccepted) && (
        <div className="fin-card" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                {offerAccepted ? 'Offer Accepted ✓' : 'Loan Offer Ready'}
              </span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
                Approved Loan Offer
              </h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Application ID</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4f46e5', fontFamily: 'var(--font-mono)' }}>{app.id || 'CR7219'}</div>
            </div>
          </div>

          {offerAccepted ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px', borderRadius: '16px', textAlign: 'center', marginBottom: '24px' }}>
              <CheckCircleIcon size={40} color="#059669" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#047857', marginTop: '8px' }}>
                Loan Offer Accepted Successfully ✓
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#065f46', marginTop: '4px' }}>
                Your agreement for ₹{Number(approvedAmt).toLocaleString('en-IN')} has been finalized.
              </p>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #065f46 100%)', color: '#ffffff', padding: '28px', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: '700' }}>Sanctioned Amount</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '4px 0' }}>
                ₹{Number(approvedAmt).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Requested: ₹{Number(requestedAmt).toLocaleString('en-IN')} | Interest Rate: <strong>{decisionResult.interestRate}% p.a.</strong>
              </div>
            </div>
          )}

          {/* Offer Parameters Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Approved Amount</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
                ₹{Number(approvedAmt).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Interest Rate</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#4f46e5', marginTop: '4px' }}>
                {decisionResult.interestRate}% p.a.
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Loan Tenure</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {app.tenure || 24} Months
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Est. Monthly EMI</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                ₹{decisionResult.estimatedEmi.toLocaleString('en-IN')}/mo
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button onClick={onBackToDashboard} className="btn btn-secondary">
              Back to Dashboard
            </button>

            {!offerAccepted && (
              <button onClick={() => setShowAcceptModal(true)} className="btn btn-emerald btn-lg">
                <CheckCircleIcon size={20} />
                <span>Accept Loan Offer</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* 2. REJECTED WORKFLOW */}
      {isRejected && (
        <div className="fin-card" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#fff1f2', padding: '12px', borderRadius: '50%', color: '#e11d48' }}>
              <XCircleIcon size={32} />
            </div>
            <div>
              <span className="badge badge-rejected" style={{ fontSize: '0.8rem' }}>Status: REJECTED</span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                Loan Application Rejected
              </h1>
            </div>
          </div>

          {/* Reason Box */}
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '20px', borderRadius: '14px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#9f1239', textTransform: 'uppercase', marginBottom: '6px' }}>
              Reason for Decision
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#881337' }}>
              "{app.rejectionReason || 'High existing debt burden'}"
            </div>
            {app.rejectionComments && (
              <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '8px' }}>
                {app.rejectionComments}
              </div>
            )}
          </div>

          {/* Decision Factors */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
              Why Was This Decision Made?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#166534', marginBottom: '8px' }}>✓ Positive Factors</div>
                <ul style={{ margin: '0 0 0 16px', fontSize: '0.85rem', color: '#14532d' }}>
                  {(app.positiveFactors || decisionResult.positiveFactors).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              <div style={{ background: '#fff1f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#9f1239', marginBottom: '8px' }}>⚠ Risk & Attention Areas</div>
                <ul style={{ margin: '0 0 0 16px', fontSize: '0.85rem', color: '#881337' }}>
                  {(app.negativeFactors || decisionResult.negativeFactors).map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button onClick={onBackToDashboard} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>

        </div>
      )}

      {/* 3. PENDING REVIEW WORKFLOW */}
      {isPending && (
        <div className="fin-card" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '50%', color: '#d97706' }}>
              <ClockIcon size={32} />
            </div>
            <div>
              <span className="badge badge-review" style={{ fontSize: '0.8rem' }}>Status: Pending Review</span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                Application Under Review
              </h1>
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '14px', color: '#92400e', fontSize: '0.95rem', fontWeight: '600', marginBottom: '24px', lineHeight: 1.5 }}>
            "Your application is currently being reviewed by a loan officer."
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Application ID</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{app.id || 'CR7219'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Requested Amount</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#059669' }}>₹{Number(requestedAmt).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button onClick={onBackToDashboard} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>

        </div>
      )}

      {/* CONFIRMATION MODAL FOR ACCEPT OFFER */}
      {showAcceptModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="fin-card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Accept Loan Offer?
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to accept this approved loan offer of <strong>₹{Number(approvedAmt).toLocaleString('en-IN')}</strong> for <strong>{app.tenure || 24} Months</strong>?
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAcceptModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmAccept} className="btn btn-emerald">
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
