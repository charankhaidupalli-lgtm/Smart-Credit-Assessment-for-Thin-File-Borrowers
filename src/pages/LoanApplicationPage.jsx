import React, { useState, useEffect } from 'react';
import { calculateCreditDecision } from '../utils/creditEngine';
import { 
  ShieldCheckIcon, 
  RupeeIcon, 
  ArrowRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  UploadIcon,
  TrashIcon,
  EyeIcon,
  AlertTriangleIcon,
  ZapIcon
} from '../components/Icons';

export function LoanApplicationPage({ user, formData, setFormData, onSubmitApplication, onBackToDashboard, onViewApplication }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Income, 3: Alt Data, 4: Upload Documents, 5: Review
  const [validationErrors, setValidationErrors] = useState({});
  const [submittedApp, setSubmittedApp] = useState(null);
  const [viewingDocModal, setViewingDocModal] = useState(null);

  // Automatically pre-fill logged-in applicant name, email, and phone
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fullName: user?.fullName || prev.fullName || 'Applicant',
      email: user?.email || prev.email || '',
      phone: user?.phone || prev.phone || '',
      employmentType: prev.employmentType || user?.employmentType || 'Salaried',
      occupation: prev.occupation || user?.occupation || 'Software Developer',
      documents: prev.documents || {
        identityProof: null,
        addressProof: null,
        incomeProof: null,
        bankStatement: null,
        existingLoanStatement: null
      }
    }));
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDocumentUpload = (docKey, file) => {
    if (!file) return;

    // Allowed file types: PDF, JPG, JPEG, PNG
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileName = file.name || '';
    const fileExt = fileName.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      setValidationErrors(prev => ({
        ...prev,
        [docKey]: `Unsupported format (.${fileExt}). Please upload PDF, JPG, or PNG files.`
      }));
      return;
    }

    // Size limit: 5MB (5 * 1024 * 1024 bytes)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setValidationErrors(prev => ({
        ...prev,
        [docKey]: 'File size exceeds maximum limit of 5 MB.'
      }));
      return;
    }

    // Format size for display
    const formattedSize = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // Create a local blob URL for viewing uploaded files
    const fileBlobUrl = URL.createObjectURL(file);

    const docObj = {
      name: file.name,
      size: formattedSize,
      type: file.type || `application/${fileExt}`,
      uploadedAt: new Date().toLocaleDateString(),
      status: 'Uploaded',
      url: fileBlobUrl
    };

    setFormData(prev => ({
      ...prev,
      documents: {
        ...(prev.documents || {}),
        [docKey]: docObj
      }
    }));

    setValidationErrors(prev => ({ ...prev, [docKey]: undefined, documents: undefined }));
  };

  const handleRemoveDocument = (docKey) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...(prev.documents || {}),
        [docKey]: null
      }
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.fullName?.trim()) errors.fullName = 'Full Name is required';
      if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 75) errors.age = 'Age must be between 18 and 75';
      if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
      if (!formData.occupation?.trim()) errors.occupation = 'Occupation is required';
    } else if (step === 2) {
      if (!formData.monthlyIncome || Number(formData.monthlyIncome) <= 0) errors.monthlyIncome = 'Monthly income is required';
      if (formData.monthlyExpenses === undefined || Number(formData.monthlyExpenses) < 0) errors.monthlyExpenses = 'Monthly expenses cannot be negative';
      if (!formData.requestedAmount || Number(formData.requestedAmount) < 5000) errors.requestedAmount = 'Requested amount is required (min ₹5,000)';
    } else if (step === 3) {
      if (formData.cashFlow === undefined || Number(formData.cashFlow) < 0) errors.cashFlow = 'Average monthly bank inflow is required';
    } else if (step === 4) {
      const docs = formData.documents || {};
      const requiredKeys = ['identityProof', 'addressProof', 'incomeProof', 'bankStatement', 'existingLoanStatement'];
      const missing = requiredKeys.filter(k => !docs[k] || docs[k].status === 'Not Uploaded');
      
      if (missing.length > 0) {
        errors.documents = 'Please upload all required documents before submitting your application.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const payload = {
      ...formData,
      fullName: formData.fullName || user?.fullName || 'Applicant',
      email: (user?.email || formData.email || '').toLowerCase().trim(),
      phone: formData.phone || user?.phone || '',
      status: 'VERIFICATION PENDING',
      documents: formData.documents || {}
    };

    const newApp = onSubmitApplication(payload);
    setSubmittedApp(newApp);
  };

  // SUBMITTED SUCCESS SCREEN
  if (submittedApp) {
    const uploadedDocs = submittedApp.documents || {};
    const uploadedCount = Object.values(uploadedDocs).filter(Boolean).length;

    return (
      <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '40px auto 0' }}>
        <div className="fin-card" style={{ padding: '36px', textAlign: 'center' }}>
          
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)'
          }}>
            <CheckCircleIcon size={40} color="#059669" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Application Submitted Successfully ✓
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fffbeb', border: '1px solid #fef3c7', padding: '6px 16px', borderRadius: '9999px', margin: '12px 0 20px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#b45309' }}>Application ID:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#92400e', fontFamily: 'var(--font-mono)' }}>{submittedApp.id}</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span className="badge badge-review">VERIFICATION PENDING</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '24px', textAlign: 'left', lineHeight: 1.6 }}>
            <div style={{ fontSize: '0.925rem', color: '#334155', fontWeight: '600', marginBottom: '10px' }}>
              "Your application and supporting documents have been submitted. A bank officer will verify the information before making a credit decision."
            </div>
            
            <div style={{ fontSize: '0.825rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>Applicant: <strong>{submittedApp.applicantName}</strong></div>
              <div>Requested: <strong>₹{Number(submittedApp.requestedAmount).toLocaleString('en-IN')}</strong></div>
              <div>Documents: <strong style={{ color: '#059669' }}>{uploadedCount} / 5 Uploaded</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button onClick={() => onViewApplication(submittedApp)} className="btn btn-secondary btn-lg">
              <FileTextIcon size={18} />
              <span>View Application</span>
            </button>

            <button onClick={onBackToDashboard} className="btn btn-primary btn-lg">
              <span>Go to Dashboard</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  const docCategories = [
    {
      key: 'identityProof',
      title: 'Identity Proof',
      purpose: "Verify the applicant's identity (e.g., Aadhaar Card, Passport, Voter ID, PAN).",
      example: `Name: ${formData.fullName || user?.fullName || 'Applicant'}`,
      defaultUrl: '/documents/identity_proof.pdf'
    },
    {
      key: 'addressProof',
      title: 'Address Proof',
      purpose: "Verify the applicant's current residential address (e.g., Utility bill, Rental agreement).",
      example: 'Current Resident Verification',
      defaultUrl: '/documents/address_proof.pdf'
    },
    {
      key: 'incomeProof',
      title: 'Income Proof',
      purpose: "Verify the monthly income entered by the applicant.",
      example: `Applicant entered: Monthly Income: ₹${Number(formData.monthlyIncome || 50000).toLocaleString('en-IN')}`,
      defaultUrl: '/documents/income_proof.pdf'
    },
    {
      key: 'bankStatement',
      title: 'Bank Statement',
      purpose: "Help the officer verify the applicant's bank financial activity and income inflow.",
      example: `Applicant entered: Average Inflow: ₹${Number(formData.cashFlow || 35000).toLocaleString('en-IN')}`,
      defaultUrl: '/documents/bank_statement.pdf'
    },
    {
      key: 'existingLoanStatement',
      title: 'Existing Loan Statement',
      purpose: "Verify existing loan debt, monthly EMI, and current loan obligations.",
      example: `Applicant entered: Existing EMI: ₹${Number(formData.existingEmi || 0).toLocaleString('en-IN')}`,
      defaultUrl: '/documents/existing_loan_statement.pdf'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Apply for New Loan
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Fill in your details and upload required verification documents for loan review.
          </p>
        </div>
      </div>

      {/* 5-Step Wizard Navigation Bar */}
      <div className="fin-card" style={{ padding: '16px 20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '640px' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(1)}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 1 ? '#4f46e5' : '#e2e8f0', color: currentStep >= 1 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>1</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: currentStep === 1 ? '#4f46e5' : '#0f172a' }}>Personal Info</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Step 1</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: currentStep >= 2 ? '#4f46e5' : '#e2e8f0', margin: '0 6px' }} />

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(2)}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 2 ? '#4f46e5' : '#e2e8f0', color: currentStep >= 2 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>2</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: currentStep === 2 ? '#4f46e5' : '#0f172a' }}>Income Details</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Step 2</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: currentStep >= 3 ? '#4f46e5' : '#e2e8f0', margin: '0 6px' }} />

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(3)}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 3 ? '#4f46e5' : '#e2e8f0', color: currentStep >= 3 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>3</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: currentStep === 3 ? '#4f46e5' : '#0f172a' }}>Alt Financial</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Step 3</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: currentStep >= 4 ? '#4f46e5' : '#e2e8f0', margin: '0 6px' }} />

          {/* Step 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(4)}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 4 ? '#4f46e5' : '#e2e8f0', color: currentStep >= 4 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>4</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: currentStep === 4 ? '#4f46e5' : '#0f172a' }}>Upload Proofs</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Step 4</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: currentStep >= 5 ? '#4f46e5' : '#e2e8f0', margin: '0 6px' }} />

          {/* Step 5 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentStep(5)}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 5 ? '#4f46e5' : '#e2e8f0', color: currentStep >= 5 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>5</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: currentStep === 5 ? '#4f46e5' : '#0f172a' }}>Review</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Step 5</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Form Content */}
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div className="fin-card" style={{ padding: '28px' }}>
          
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                Step 1 — Personal Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.fullName ? 'error' : ''}`}
                    value={formData.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Charan"
                  />
                  {validationErrors.fullName && <div className="form-error">{validationErrors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Age (Years)</label>
                  <input
                    type="number"
                    className={`form-input ${validationErrors.age ? 'error' : ''}`}
                    value={formData.age || ''}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="26"
                  />
                  {validationErrors.age && <div className="form-error">{validationErrors.age}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 12345"
                  />
                  {validationErrors.phone && <div className="form-error">{validationErrors.phone}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email || user?.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="applicant@example.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select
                    className="form-select"
                    value={formData.employmentType || 'Salaried'}
                    onChange={(e) => handleChange('employmentType', e.target.value)}
                  >
                    <option value="Salaried">Salaried Employee</option>
                    <option value="Self-Employed">Self-Employed Professional</option>
                    <option value="Freelancer">Freelancer / Consultant</option>
                    <option value="Gig Worker">Gig Economy Worker</option>
                    <option value="Business Owner">Business Owner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.occupation ? 'error' : ''}`}
                    value={formData.occupation || ''}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                  {validationErrors.occupation && <div className="form-error">{validationErrors.occupation}</div>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Income Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                Step 2 — Income Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Income (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className={`form-input ${validationErrors.monthlyIncome ? 'error' : ''}`}
                      value={formData.monthlyIncome || ''}
                      onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  {validationErrors.monthlyIncome && <div className="form-error">{validationErrors.monthlyIncome}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Other Monthly Income (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.otherIncome || ''}
                      onChange={(e) => handleChange('otherIncome', e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Expenses (₹)</label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    className={`form-input ${validationErrors.monthlyExpenses ? 'error' : ''}`}
                    value={formData.monthlyExpenses || ''}
                    onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
                    placeholder="20000"
                  />
                </div>
                {validationErrors.monthlyExpenses && <div className="form-error">{validationErrors.monthlyExpenses}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Requested Loan Amount (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className={`form-input ${validationErrors.requestedAmount ? 'error' : ''}`}
                      style={{ fontWeight: '700' }}
                      value={formData.requestedAmount || ''}
                      onChange={(e) => handleChange('requestedAmount', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  {validationErrors.requestedAmount && <div className="form-error">{validationErrors.requestedAmount}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Loan Tenure</label>
                  <select
                    className="form-select"
                    value={formData.tenure || 24}
                    onChange={(e) => handleChange('tenure', Number(e.target.value))}
                  >
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                    <option value={48}>48 months</option>
                    <option value={60}>60 months</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Alternative Financial Data */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                Step 3 — Alternative Financial Data
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Rent (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.monthlyRent || ''}
                      onChange={(e) => handleChange('monthlyRent', e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Electricity / Utility Bills (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.utilityPayments || ''}
                      onChange={(e) => handleChange('utilityPayments', e.target.value)}
                      placeholder="2500"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone / Telecom Bills (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.telecomPayments || ''}
                      onChange={(e) => handleChange('telecomPayments', e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Average Monthly Bank Inflow (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className={`form-input ${validationErrors.cashFlow ? 'error' : ''}`}
                      value={formData.cashFlow || ''}
                      onChange={(e) => handleChange('cashFlow', e.target.value)}
                      placeholder="35000"
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Average total money received into your bank account each month.
                  </div>
                  {validationErrors.cashFlow && <div className="form-error">{validationErrors.cashFlow}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Existing Total Loan Debt (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.existingLoanAmount || ''}
                      onChange={(e) => handleChange('existingLoanAmount', e.target.value)}
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Existing Monthly EMI (₹)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.existingEmi || ''}
                      onChange={(e) => handleChange('existingEmi', e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: UPLOAD SUPPORTING DOCUMENTS */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', padding: '18px 20px', borderRadius: '14px', border: '1px solid #c7d2fe', marginBottom: '24px' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#3730a3', marginBottom: '4px' }}>
                  Verify Your Financial Information
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4338ca', lineHeight: 1.5 }}>
                  "Upload supporting documents so that a bank officer can verify the information provided in your loan application."
                </div>
              </div>

              {validationErrors.documents && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '12px 16px', borderRadius: '10px', color: '#e11d48', fontSize: '0.875rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangleIcon size={18} color="#e11d48" />
                  <span>{validationErrors.documents}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                {docCategories.map(cat => {
                  const doc = formData.documents?.[cat.key];
                  const isUploaded = !!doc && doc.status !== 'Not Uploaded';

                  return (
                    <div 
                      key={cat.key} 
                      className="fin-card" 
                      style={{ 
                        padding: '20px', 
                        border: isUploaded ? '1.5px solid #a7f3d0' : '1px solid #e2e8f0', 
                        background: isUploaded ? '#f0fdf4' : '#ffffff',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            {cat.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                            {cat.purpose}
                          </div>
                        </div>

                        {isUploaded ? (
                          <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                            ✓ Uploaded
                          </span>
                        ) : (
                          <span className="badge badge-review" style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}>
                            Not Uploaded
                          </span>
                        )}
                      </div>

                      {/* Display dynamic income / financial hint */}
                      <div style={{ background: isUploaded ? '#ecfdf5' : '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#475569', fontWeight: '600', marginBottom: '14px' }}>
                        {cat.example}
                      </div>

                      {validationErrors[cat.key] && (
                        <div style={{ color: '#e11d48', fontSize: '0.78rem', fontWeight: '700', marginBottom: '10px' }}>
                          ⚠️ {validationErrors[cat.key]}
                        </div>
                      )}

                      {/* Card Content based on state */}
                      {!isUploaded ? (
                        <div style={{ border: '2px dashed #cbd5e1', padding: '16px', borderRadius: '12px', textAlign: 'center', background: '#ffffff' }}>
                          <UploadIcon size={24} color="#64748b" />
                          <div style={{ fontSize: '0.8rem', color: '#64748b', margin: '8px 0 12px' }}>
                            Accepted formats: <strong>PDF, JPG, PNG</strong> (Max: 5 MB)
                          </div>
                          
                          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                            <UploadIcon size={14} />
                            <span>Upload Document</span>
                            <input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleDocumentUpload(cat.key, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <FileTextIcon size={24} color="#059669" />
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {doc.name}
                              </div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                                {doc.size} • Uploaded on {doc.uploadedAt}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            <button 
                              type="button"
                              onClick={() => setViewingDocModal({ category: cat.title, key: cat.key, doc, defaultUrl: cat.defaultUrl })} 
                              className="btn btn-secondary btn-sm" 
                              style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}
                            >
                              <EyeIcon size={13} /> View
                            </button>

                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', flex: 1, fontSize: '0.75rem', padding: '4px 8px', textAlign: 'center' }}>
                              <span>Replace</span>
                              <input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleDocumentUpload(cat.key, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>

                            <button 
                              type="button"
                              onClick={() => handleRemoveDocument(cat.key)} 
                              className="btn btn-secondary btn-sm" 
                              style={{ color: '#e11d48', borderColor: '#fecdd3', fontSize: '0.75rem', padding: '4px 8px' }}
                            >
                              <TrashIcon size={13} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Demo Notice */}
              <div style={{ marginTop: '24px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.78rem', color: '#64748b' }}>
                <strong style={{ color: '#334155' }}>Demo Notice:</strong> This prototype demonstrates document submission and officer verification workflow. Uploaded documents are stored in <code>/public/documents</code> directory for demonstration purposes.
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW BEFORE SUBMISSION */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                Review Your Application
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
                Please review all information and uploaded documents before final submission.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Personal Information */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4f46e5', marginBottom: '8px' }}>
                    Personal Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                    <div>Name: <strong>{formData.fullName || user?.fullName}</strong></div>
                    <div>Age: <strong>{formData.age} years</strong></div>
                    <div>Occupation: <strong>{formData.occupation}</strong></div>
                    <div>Employment: <strong>{formData.employmentType || 'Salaried'}</strong></div>
                    <div>Phone: <strong>{formData.phone}</strong></div>
                    <div>Email: <strong>{formData.email || user?.email}</strong></div>
                  </div>
                </div>

                {/* Financial Information */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4f46e5', marginBottom: '8px' }}>
                    Financial Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                    <div>Monthly Income: <strong>₹{Number(formData.monthlyIncome || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Monthly Expenses: <strong>₹{Number(formData.monthlyExpenses || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Requested Amount: <strong style={{ color: '#059669' }}>₹{Number(formData.requestedAmount || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Preferred Tenure: <strong>{formData.tenure || 24} months</strong></div>
                    <div>Existing Debt: <strong>₹{Number(formData.existingLoanAmount || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Existing EMI: <strong>₹{Number(formData.existingEmi || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Monthly Inflow: <strong>₹{Number(formData.cashFlow || 0).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>

                {/* Supporting Documents Status */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4f46e5', marginBottom: '12px' }}>
                    Supporting Documents
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {docCategories.map(cat => {
                      const doc = formData.documents?.[cat.key];
                      const isUploaded = !!doc && doc.status !== 'Not Uploaded';

                      return (
                        <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: '600', color: '#334155' }}>{cat.title}</span>
                          {isUploaded ? (
                            <span style={{ color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ✓ Uploaded <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '0.78rem' }}>({doc.name})</span>
                            </span>
                          ) : (
                            <span style={{ color: '#e11d48', fontWeight: '700' }}>
                              ❌ Missing Document
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notice */}
                <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', fontSize: '0.78rem', color: '#92400e' }}>
                  <strong>Important:</strong> Submitting this loan application will send all submitted data and supporting proof documents to the bank officer queue for manual verification.
                </div>

              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            {currentStep > 1 ? (
              <button type="button" onClick={handleBack} className="btn btn-secondary">
                <ChevronLeftIcon size={16} /> Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                Next Step <ArrowRightIcon size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="btn btn-emerald btn-lg">
                <CheckCircleIcon size={20} />
                <span>Submit Loan Application</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDocModal && (
        <div className="modal-backdrop" onClick={() => setViewingDocModal(null)}>
          <div className="modal-card" style={{ maxWidth: '640px', width: '92%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  📄 {viewingDocModal.category} Document
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  File: <strong>{viewingDocModal.doc.name}</strong> ({viewingDocModal.doc.size})
                </div>
              </div>
              <button onClick={() => setViewingDocModal(null)} className="btn btn-sm btn-secondary">✕</button>
            </div>

            {/* Render PDF iframe and Open PDF Button */}
            {(() => {
              const defaultPdfMap = {
                identityProof: '/documents/identity_proof.pdf',
                addressProof: '/documents/address_proof.pdf',
                incomeProof: '/documents/income_proof.pdf',
                bankStatement: '/documents/bank_statement.pdf',
                existingLoanStatement: '/documents/existing_loan_statement.pdf'
              };
              const pdfUrl = viewingDocModal.doc?.url || viewingDocModal.defaultUrl || defaultPdfMap[viewingDocModal.key] || '/documents/identity_proof.pdf';

              return (
                <div>
                  <div style={{ marginBottom: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <iframe
                      src={pdfUrl}
                      title="PDF Document Viewer"
                      width="100%"
                      height="360px"
                      style={{ border: 'none', display: 'block' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => window.open(pdfUrl, '_blank')}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#818cf8', color: '#4f46e5' }}
                    >
                      <span>Open PDF in New Tab ↗</span>
                    </button>

                    <button onClick={() => setViewingDocModal(null)} className="btn btn-primary btn-sm">
                      Close Viewer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}
