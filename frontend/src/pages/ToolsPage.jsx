import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import './css-pages/ToolsPage.css';

// --- Sub-components for Calculators ---

const SIPCalculator = () => {
  const [type, setType] = useState('sip'); // sip or lumpsum
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let totalValue, totalInvested;

    if (type === 'sip') {
      totalInvested = amount * n;
      totalValue = amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else {
      totalInvested = amount;
      totalValue = amount * Math.pow(1 + rate / 100, years);
    }

    const estReturns = totalValue - totalInvested;
    return { totalInvested, estReturns, totalValue };
  };

  const { totalInvested, estReturns, totalValue } = calculate();

  return (
    <div className="calculator-layout">
      <div className="calc-inputs">
        <div className="calc-toggle">
          <button className={type === 'sip' ? 'active' : ''} onClick={() => setType('sip')}>Monthly SIP</button>
          <button className={type === 'lumpsum' ? 'active' : ''} onClick={() => setType('lumpsum')}>Lumpsum</button>
        </div>
        <div className="calc-group">
          <label>{type === 'sip' ? 'Monthly Investment' : 'Total Investment'}</label>
          <div className="input-with-suffix">
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <span className="input-suffix">₹</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Expected Return Rate (p.a)</label>
          <div className="input-with-suffix">
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Time Period</label>
          <div className="input-with-suffix">
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            <span className="input-suffix">Yr</span>
          </div>
        </div>
      </div>
      <div className="calc-results">
        <div>
          <div className="result-item">
            <div className="result-label">Invested Amount</div>
            <div className="result-value">₹{Math.round(totalInvested).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Est. Returns</div>
            <div className="result-value">₹{Math.round(estReturns).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Value</div>
            <div className="result-value primary">₹{Math.round(totalValue).toLocaleString()}</div>
          </div>
        </div>
        <div className="visual-summary">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${(totalInvested / totalValue) * 100}%`, backgroundColor: '#e2e8f0' }} />
            <div className="progress-bar-fill" style={{ width: `${(estReturns / totalValue) * 100}%`, backgroundColor: '#3b82f6' }} />
          </div>
          <div className="calc-legend">
            <div className="legend-item"><span className="legend-dot" style={{ background: '#e2e8f0' }} /> Invested</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} /> Returns</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EMICalculator = () => {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculate = () => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loan;
    return { emi, totalInterest, totalPayment };
  };

  const { emi, totalInterest, totalPayment } = calculate();

  return (
    <div className="calculator-layout">
      <div className="calc-inputs">
        <div className="calc-group">
          <label>Loan Amount</label>
          <div className="input-with-suffix">
            <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
            <span className="input-suffix">₹</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Interest Rate (p.a)</label>
          <div className="input-with-suffix">
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Loan Tenure</label>
          <div className="input-with-suffix">
            <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
            <span className="input-suffix">Yr</span>
          </div>
        </div>
      </div>
      <div className="calc-results">
        <div>
          <div className="result-item">
            <div className="result-label">Monthly EMI</div>
            <div className="result-value primary">₹{Math.round(emi).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Principal Amount</div>
            <div className="result-value">₹{loan.toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Interest</div>
            <div className="result-value">₹{Math.round(totalInterest).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Amount Payable</div>
            <div className="result-value">₹{Math.round(totalPayment).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState({ USD: 1, INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 150.1 });

  // Simulate API fetch or use static for demo
  useEffect(() => {
    // In a real app, fetch from an API here
  }, []);

  const result = (amount / rates[from]) * rates[to];

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="calculator-layout">
      <div className="calc-inputs">
        <div className="calc-group">
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="currency-row">
          <div className="calc-group">
            <label>From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="currency-swap">
          <button className="swap-btn" onClick={swap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>
        </div>
        <div className="currency-row">
          <div className="calc-group">
            <label>To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="calc-results">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
          <div className="result-label">{amount} {from} equals</div>
          <div className="result-value primary" style={{ fontSize: '3rem' }}>{result.toFixed(2)} {to}</div>
          <div className="result-label" style={{ marginTop: '1rem' }}>1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</div>
        </div>
      </div>
    </div>
  );
};

const RetirementPlanner = () => {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);
  const [expenses, setExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(12);

  const calculate = () => {
    const yearsToRetire = retirementAge - currentAge;
    const futureExpenses = expenses * Math.pow(1 + inflation / 100, yearsToRetire);
    // Rough estimate for corpus needed (X25 rule or similar)
    const corpusNeeded = futureExpenses * 12 * 20; 
    const monthlySavingNeeded = (corpusNeeded * (returns / 100 / 12)) / (Math.pow(1 + returns / 100 / 12, yearsToRetire * 12) - 1);
    return { futureExpenses, corpusNeeded, monthlySavingNeeded };
  };

  const { futureExpenses, corpusNeeded, monthlySavingNeeded } = calculate();

  return (
    <div className="calculator-layout">
      <div className="calc-inputs">
        <div className="calc-group">
          <label>Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        </div>
        <div className="calc-group">
          <label>Retirement Age</label>
          <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
        </div>
        <div className="calc-group">
          <label>Current Monthly Expenses</label>
          <div className="input-with-suffix">
            <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} />
            <span className="input-suffix">₹</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Expected Inflation</label>
          <div className="input-with-suffix">
            <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
            <span className="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div className="calc-results">
        <div>
          <div className="result-item">
            <div className="result-label">Monthly Expense at Retirement</div>
            <div className="result-value">₹{Math.round(futureExpenses).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Target Corpus Needed</div>
            <div className="result-value">₹{Math.round(corpusNeeded).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Savings Required</div>
            <div className="result-value primary">₹{Math.round(monthlySavingNeeded).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(5);
  const [freq, setFreq] = useState(1); // annual

  const calculate = () => {
    const amount = principal * Math.pow(1 + rate / 100 / freq, freq * time);
    const interest = amount - principal;
    return { amount, interest };
  };

  const { amount, interest } = calculate();

  return (
    <div className="calculator-layout">
      <div className="calc-inputs">
        <div className="calc-group">
          <label>Principal Amount</label>
          <div className="input-with-suffix">
            <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
            <span className="input-suffix">₹</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Annual Interest Rate</label>
          <div className="input-with-suffix">
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <div className="calc-group">
          <label>Time Period (Years)</label>
          <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
        </div>
        <div className="calc-group">
          <label>Compounding Frequency</label>
          <select value={freq} onChange={(e) => setFreq(Number(e.target.value))}>
            <option value={1}>Annually</option>
            <option value={2}>Half-Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
          </select>
        </div>
      </div>
      <div className="calc-results">
        <div>
          <div className="result-item">
            <div className="result-label">Principal Amount</div>
            <div className="result-value">₹{principal.toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Interest</div>
            <div className="result-value">₹{Math.round(interest).toLocaleString()}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Value</div>
            <div className="result-value primary">₹{Math.round(amount).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'sip',
      title: 'Mutual Fund Calculator',
      description: 'Estimate returns on SIP and lump sum investments with different time periods.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      component: <SIPCalculator />
    },
    {
      id: 'currency',
      title: 'Currency Converter',
      description: 'Real-time exchange rates for forex trading and international investments.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      ),
      component: <CurrencyConverter />
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate your monthly loan EMIs, interest, and total payable amount.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h0M2 9.5h20" />
        </svg>
      ),
      component: <EMICalculator />
    },
    {
      id: 'retirement',
      title: 'Retirement Planner',
      description: 'Plan your retirement by estimating the corpus and savings needed.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      ),
      component: <RetirementPlanner />
    },
    {
      id: 'wealth',
      title: 'Wealth Growth',
      description: 'See how your money grows over time with compound interest.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      component: <CompoundInterest />
    }
  ];

  return (
    <div className="tools-page">
      <Header />
      
      <main className="tools-container">
        <motion.div 
          className="tools-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Financial Tools</h1>
          <p>Professional-grade calculators to help you plan your investments and manage your finances effectively.</p>
        </motion.div>

        <div className="tools-grid">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="tool-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveTool(tool)}
            >
              <div className="tool-card__icon">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <div className="tool-card__action">
                Open Tool
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {activeTool && (
          <motion.div 
            className="calculator-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTool(null)}
          >
            <motion.div 
              className="calculator-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="calculator-close" onClick={() => setActiveTool(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              
              <div className="calculator-content">
                <div style={{ marginBottom: '2rem' }}>
                  <div className="tool-card__icon" style={{ marginBottom: '1rem' }}>{activeTool.icon}</div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{activeTool.title}</h2>
                  <p style={{ color: '#64748b', fontSize: '1.125rem' }}>{activeTool.description}</p>
                </div>
                
                {activeTool.component}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HomePageFutter />
    </div>
  );
};
