/**
 * Seed Profiles & Mock Data for Smart Credit Decisioning System
 */

export const INITIAL_USER = {
  fullName: 'Charan',
  email: 'charan@example.com',
  phone: '+91 98765 12345',
  employmentType: 'Salaried',
  occupation: 'Software Developer',
  role: 'applicant' // 'applicant' or 'admin'
};

export const DEMO_PRESETS = [];

export const INITIAL_APPLICATIONS = [
  // Charan's Pending Loan Application
  {
    id: 'CR7219',
    applicantName: 'Charan',
    email: 'charan@example.com',
    phone: '+91 98765 12345',
    age: 26,
    employmentType: 'Salaried',
    occupation: 'Software Developer',
    requestedAmount: 50000,
    approvedAmount: 50000,
    tenure: 24,
    appliedDate: '2026-10-05',
    creditScore: 742,
    riskLevel: 'Medium Risk',
    status: 'Pending Review',
    monthlyIncome: 55000,
    otherIncome: 5000,
    monthlyExpenses: 22000,
    monthlyRent: 10000,
    utilityPayments: 2500,
    telecomPayments: 1000,
    cashFlow: 35000,
    existingLoanAmount: 25000,
    existingEmi: 5000,
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
  },
  // Charan's Approved Loan Application
  {
    id: 'CR7220',
    applicantName: 'Charan',
    email: 'charan@example.com',
    phone: '+91 98765 12345',
    age: 26,
    employmentType: 'Salaried',
    occupation: 'Software Developer',
    requestedAmount: 100000,
    approvedAmount: 100000,
    tenure: 36,
    appliedDate: '2026-10-01',
    approvalDate: '2026-10-02',
    creditScore: 780,
    riskLevel: 'Low Risk',
    status: 'Approved',
    monthlyIncome: 65000,
    otherIncome: 5000,
    monthlyExpenses: 20000,
    monthlyRent: 12000,
    utilityPayments: 2000,
    telecomPayments: 1000,
    cashFlow: 40000,
    existingLoanAmount: 20000,
    existingEmi: 4000,
    rejectionReason: '',
    rejectionComments: '',
    positiveFactors: ['Low DTI ratio', 'Healthy bank activity', 'Proven repayment track record'],
    negativeFactors: []
  }
];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-1',
    applicantEmail: 'charan@example.com',
    title: 'Application Submitted',
    message: 'Your application CR7219 has been submitted.',
    time: '10 mins ago',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-2',
    applicantEmail: 'charan@example.com',
    title: 'Status Update',
    message: 'Your application is under review.',
    time: '1 hour ago',
    read: false,
    type: 'warning'
  }
];

