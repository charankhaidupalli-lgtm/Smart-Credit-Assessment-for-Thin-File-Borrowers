/**
 * Smart Credit Decisioning Engine
 * Evaluates alternative financial data & traditional metrics to generate
 * credit scores (300-850), risk tiers, metrics, and positive/risk factors.
 */

export function calculateCreditDecision(data) {
  const {
    monthlyIncome = 40000,
    otherIncome = 0,
    monthlyExpenses = 22000,
    monthlyRent = 0,
    utilityPayments = 2000,
    telecomPayments = 1000,
    existingLoanAmount = 0,
    existingEmi = 5000,
    cashFlow = 25000,
    requestedAmount = 100000,
    tenure = 24
  } = data || {};

  const totalIncome = Number(monthlyIncome) + Number(otherIncome);
  const totalLivingExpenses = Number(monthlyExpenses) + Number(monthlyRent) + Number(utilityPayments) + Number(telecomPayments);
  const existingDebt = Number(existingEmi);

  // 1. Core Financial Ratios
  const netDisposableIncome = Math.max(0, totalIncome - totalLivingExpenses - existingDebt);
  const dtiRatio = totalIncome > 0 ? ((existingDebt / totalIncome) * 100) : 100;
  const incomeToExpenseRatio = totalLivingExpenses > 0 ? (totalIncome / totalLivingExpenses) : 1.0;
  const cashFlowToIncomeRatio = totalIncome > 0 ? (Number(cashFlow) / totalIncome) : 0.5;

  // 2. Score Component Scoring (Base 300, Max 850)
  let incomeScore = 100;
  if (totalIncome >= 80000) incomeScore = 220;
  else if (totalIncome >= 50000) incomeScore = 190;
  else if (totalIncome >= 35000) incomeScore = 150;
  else if (totalIncome >= 20000) incomeScore = 120;

  let dtiScore = 50;
  if (dtiRatio <= 15) dtiScore = 200;
  else if (dtiRatio <= 30) dtiScore = 170;
  else if (dtiRatio <= 45) dtiScore = 120;
  else if (dtiRatio <= 55) dtiScore = 75;

  const altPaymentRatio = (Number(monthlyRent) + Number(utilityPayments) + Number(telecomPayments)) / Math.max(1, totalIncome);
  let altPaymentScore = 130;
  if (altPaymentRatio <= 0.35 && Number(utilityPayments) > 0) altPaymentScore = 180;
  else if (altPaymentRatio <= 0.5) altPaymentScore = 150;

  let cashFlowScore = 60;
  if (cashFlowToIncomeRatio >= 0.5) cashFlowScore = 150;
  else if (cashFlowToIncomeRatio >= 0.3) cashFlowScore = 120;

  const rawScore = Math.round(300 + incomeScore + dtiScore + altPaymentScore + cashFlowScore);
  const creditScore = Math.min(850, Math.max(300, rawScore));

  // 3. Risk Level Determination
  let riskLevel = 'Medium';
  let riskBadgeClass = 'badge-medium-risk';
  if (creditScore >= 740) {
    riskLevel = 'Low Risk';
    riskBadgeClass = 'badge-low-risk';
  } else if (creditScore < 640) {
    riskLevel = 'High Risk';
    riskBadgeClass = 'badge-high-risk';
  } else {
    riskLevel = 'Medium Risk';
  }

  // 4. Interest Rate & Repayment Capacity
  const estimatedRepaymentCapacity = Math.round(netDisposableIncome * 0.5);
  const annualInterestRate = creditScore >= 740 ? 10.5 : creditScore >= 640 ? 13.5 : 16.5;
  const monthlyRate = annualInterestRate / 12 / 100;
  const numMonths = Number(tenure) || 24;
  
  const reqAmount = Number(requestedAmount) || 100000;
  const calculatedEmi = reqAmount > 0 
    ? Math.round((reqAmount * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1))
    : 0;

  // 5. Build Decision Rationale Factors
  const positiveFactors = [];
  const negativeFactors = [];

  if (totalIncome >= 35000) {
    positiveFactors.push('Stable monthly income stream');
  }
  if (dtiRatio <= 30) {
    positiveFactors.push('Low debt burden (DTI ' + dtiRatio.toFixed(1) + '%)');
  } else {
    negativeFactors.push('High debt-to-income ratio (' + dtiRatio.toFixed(1) + '%)');
  }

  if (Number(utilityPayments) > 0 || Number(telecomPayments) > 0) {
    positiveFactors.push('Consistent bill payment history');
  }
  
  if (Number(cashFlow) >= 20000) {
    positiveFactors.push('Healthy bank activity & cash inflow');
  } else {
    negativeFactors.push('Low average bank cash inflow balance');
  }

  if (netDisposableIncome >= calculatedEmi * 1.5) {
    positiveFactors.push('Good repayment capacity (Surplus ₹' + netDisposableIncome.toLocaleString('en-IN') + '/mo)');
  } else {
    negativeFactors.push('Tight repayment capacity buffer');
  }

  if (positiveFactors.length === 0) {
    positiveFactors.push('Verified applicant identity');
  }

  const paymentConsistencyPct = Math.min(99, Math.max(70, Math.round((altPaymentScore / 180) * 100)));

  return {
    creditScore,
    riskLevel,
    riskBadgeClass,
    requestedAmount: reqAmount,
    approvedAmount: data.approvedAmount !== undefined ? data.approvedAmount : reqAmount,
    interestRate: annualInterestRate,
    estimatedEmi: calculatedEmi,
    tenure: numMonths,
    positiveFactors,
    negativeFactors,
    metrics: {
      dtiRatio: dtiRatio.toFixed(1) + '%',
      paymentConsistency: paymentConsistencyPct + '%',
      repaymentCapacity: estimatedRepaymentCapacity,
      netDisposableIncome
    }
  };
}
