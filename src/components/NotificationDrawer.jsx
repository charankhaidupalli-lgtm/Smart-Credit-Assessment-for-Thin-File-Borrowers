import React from 'react';
import { BellIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from './Icons';

export function NotificationDrawer({ isOpen, onClose, notifications, setNotifications }) {
  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-10px 0 25px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BellIcon size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Notifications</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', padding: '4px' }}
          >
            ×
          </button>
        </div>

        {/* Actions */}
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
            {notifications.filter(n => !n.read).length} unread updates
          </span>
          <button
            onClick={markAllRead}
            style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: n.read ? '#ffffff' : '#f0f9ff',
                  border: `1px solid ${n.read ? '#e2e8f0' : '#bae6fd'}`,
                  marginBottom: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {n.type === 'success' ? (
                    <CheckCircleIcon size={20} color="#059669" />
                  ) : n.type === 'warning' ? (
                    <AlertTriangleIcon size={20} color="#d97706" />
                  ) : (
                    <BellIcon size={20} color="#0284c7" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '6px' }}>{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
