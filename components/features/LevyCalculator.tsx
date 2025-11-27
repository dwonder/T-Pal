import React, { useState, useMemo } from 'react';
import { CompanyStatus } from '../../types';
import { InfoIcon } from '../icons';
import { Tooltip } from '../ui/Tooltip';

interface LevyCalculatorProps {
  companyStatus: CompanyStatus;
}

const formatNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
};

export const LevyCalculator: React.FC<LevyCalculatorProps> = ({ companyStatus }) => {
  const [assessableProfits, setAssessableProfits] = useState('');

  const developmentLevy = useMemo(() => {
    if (companyStatus !== CompanyStatus.MEDIUM_LARGE) return 0;
    const profits = parseFormattedNumber(assessableProfits);
    return profits * 0.04;
  }, [assessableProfits, companyStatus]);

  if (companyStatus === CompanyStatus.UNKNOWN) {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">"Levy-in-One" Calculator</h2>
                <p className="text-gray-600 dark:text-gray-400">Please complete the "Small Company" Classifier first to determine your eligibility for this section.</p>
            </div>
        </div>
    );
  }

  if (companyStatus === CompanyStatus.SMALL) {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 text-center">
            <div className="bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200 p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">"Levy-in-One" Calculator</h2>
                <p>As a Small Company, you are EXEMPT from the 4% Development Levy and also exempt from deducting Withholding Tax (WHT).</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">"Levy-in-One" Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">For Medium/Large Companies, calculate your unified Development Levy.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <label htmlFor="profits" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter your assessable profits (₦)</label>
             <Tooltip content="Profit adjusted for tax purposes according to CITA." position="right">
                <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <InfoIcon className="w-4 h-4" />
                </button>
             </Tooltip>
          </div>
          <div className="relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-500 sm:text-sm">₦</span>
            </div>
            <input
              type="text"
              id="profits"
              value={assessableProfits}
              onChange={(e) => setAssessableProfits(formatNumber(e.target.value))}
              className="block w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-colors"
              placeholder="e.g., 25,000,000"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Calculated Development Levy (4%)</h3>
              <Tooltip content="4% of Assessable Profit">
                <span className="text-gray-400"><InfoIcon className="w-4 h-4" /></span>
              </Tooltip>
          </div>
          <p className="mt-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">₦{developmentLevy.toLocaleString()}</p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Withholding Tax (WHT)</h3>
             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Under the new law, a flat rate of 2% WHT applies to goods and services. As a Medium/Large company, you are required to deduct this from payments to your vendors.
             </p>
        </div>
      </div>
    </div>
  );
};