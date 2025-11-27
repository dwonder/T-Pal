
import React, { useState, useCallback } from 'react';
import { CompanyStatus } from '../../types';

interface ClassifierProps {
  setCompanyStatus: (status: CompanyStatus) => void;
  companyStatus: CompanyStatus;
}

const formatNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
};

export const Classifier: React.FC<ClassifierProps> = ({ setCompanyStatus, companyStatus }) => {
  const [turnover, setTurnover] = useState('');
  const [assets, setAssets] = useState('');
  const [verdict, setVerdict] = useState<CompanyStatus>(companyStatus);

  const handleClassification = useCallback(() => {
    const turnoverNum = parseFormattedNumber(turnover);
    const assetsNum = parseFormattedNumber(assets);

    if (turnoverNum < 100000000 && assetsNum < 250000000) {
      setVerdict(CompanyStatus.SMALL);
      setCompanyStatus(CompanyStatus.SMALL);
    } else {
      setVerdict(CompanyStatus.MEDIUM_LARGE);
      setCompanyStatus(CompanyStatus.MEDIUM_LARGE);
    }
  }, [turnover, assets, setCompanyStatus]);

  const VerdictCard: React.FC<{ status: CompanyStatus }> = ({ status }) => {
    if (status === CompanyStatus.UNKNOWN) return null;

    const isSmall = status === CompanyStatus.SMALL;
    const cardClasses = isSmall
      ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200'
      : 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200';
    
    return (
      <div className={`mt-8 p-6 rounded-lg border-l-4 ${cardClasses}`}>
        <h3 className="text-xl font-bold mb-2">Verdict: You are a {isSmall ? 'Small' : 'Medium/Large'} Company</h3>
        {isSmall ? (
          <p>You are EXEMPT from Company Income Tax (CIT), Capital Gains Tax (CGT), and the new 4% Development Levy. Your primary obligation is to file returns to prove your status. TaxPadi is here to help you do that efficiently.</p>
        ) : (
          <p>Your Company Income Tax (CIT) rate is 30% and you are required to pay the 4% Development Levy. TaxPadi will help you calculate and manage these obligations.</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">"Small Company" Classifier</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Answer two simple questions to determine your company's tax status under the new NTA laws.</p>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label htmlFor="turnover" className="block text-sm font-medium text-gray-700 dark:text-gray-300">What was your total sales (turnover) last year? (₦)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-500 sm:text-sm">₦</span>
            </div>
            <input
              type="text"
              id="turnover"
              value={turnover}
              onChange={(e) => setTurnover(formatNumber(e.target.value))}
              className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 50,000,000"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="assets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">What is the total value of your fixed assets? (₦)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-500 sm:text-sm">₦</span>
            </div>
            <input
              type="text"
              id="assets"
              value={assets}
              onChange={(e) => setAssets(formatNumber(e.target.value))}
              className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10,000,000"
            />
          </div>
        </div>
        
        <button
          onClick={handleClassification}
          disabled={!turnover || !assets}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Classify My Company
        </button>
      </div>

      <VerdictCard status={verdict} />
    </div>
  );
};
