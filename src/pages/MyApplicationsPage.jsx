import React from 'react';
import { EyeIcon, PlusIcon, FileTextIcon, TrashIcon } from '../components/Icons';

export function MyApplicationsPage({ userApplications, onApplyNew, onViewDecision, onDeleteApplication }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            My Applications
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Track all loan requests submitted under your personal account.
          </p>
        </div>

        <button onClick={onApplyNew} className="btn btn-emerald">
          <PlusIcon size={18} />
          <span>Apply for New Loan</span>
        </button>
      </div>

      {/* Applications Table Card */}
      <div className="fin-card" style={{ padding: '24px' }}>
        {userApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <div style={{ background: '#f1f5f9', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#94a3b8' }}>
              <FileTextIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              No loan applications yet.
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
              Submit your first alternative credit loan application in less than 2 minutes.
            </p>
            <button onClick={onApplyNew} className="btn btn-primary">
              <PlusIcon size={18} /> Apply for New Loan
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Application ID</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Requested Amount</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Credit Score</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Risk Level</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                      <span className={`badge ${app.status === 'Approved' || app.status === 'APPROVED' || app.status === 'Offer Accepted' ? 'badge-approved' : app.status === 'Rejected' || app.status === 'REJECTED' ? 'badge-rejected' : 'badge-review'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onViewDecision(app)}
                          className="btn btn-sm btn-secondary"
                        >
                          <EyeIcon size={14} /> View Details
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
