
import React, { useState, useMemo } from 'react';
import { PayeResult } from '../../types';

const formatNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
};

const calculatePaye = (grossAnnual: number): PayeResult => {
    if (grossAnnual <= 800000) {
        return { paye: 0, pension: 0, nhf: 0, netPay: grossAnnual };
    }

    const pensionContribution = grossAnnual * 0.08;
    const nhfContribution = grossAnnual * 0.025;
    const consolidatedRelief = 200000 + (0.2 * grossAnnual);
    const taxableIncome = grossAnnual - pensionContribution - nhfContribution - consolidatedRelief;

    if (taxableIncome <= 0) {
        return { paye: 0, pension: pensionContribution, nhf: nhfContribution, netPay: grossAnnual - pensionContribution - nhfContribution };
    }

    let paye = 0;
    let income = taxableIncome;

    if (income > 300000) { paye += 300000 * 0.07; income -= 300000; } else { paye += income * 0.07; income = 0; }
    if (income > 0 && income > 300000) { paye += 300000 * 0.11; income -= 300000; } else { paye += income * 0.11; income = 0; }
    if (income > 0 && income > 500000) { paye += 500000 * 0.15; income -= 500000; } else { paye += income * 0.15; income = 0; }
    if (income > 0 && income > 500000) { paye += 500000 * 0.19; income -= 500000; } else { paye += income * 0.19; income = 0; }
    if (income > 0 && income > 1600000) { paye += 1600000 * 0.21; income -= 1600000; } else { paye += income * 0.21; income = 0; }
    if (income > 0) { paye += income * 0.24; }
    
    const netPay = grossAnnual - paye - pensionContribution - nhfContribution;

    return { paye, pension: pensionContribution, nhf: nhfContribution, netPay };
};

export const PayeCalculator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sme' | 'freelancer'>('sme');
    const [grossSalary, setGrossSalary] = useState('');
    const [freelanceIncome, setFreelanceIncome] = useState('');

    const smeResults = useMemo(() => {
        const gross = parseFormattedNumber(grossSalary);
        if (!gross) return null;
        return calculatePaye(gross * 12);
    }, [grossSalary]);

    const freelancerResults = useMemo(() => {
        const income = parseFormattedNumber(freelanceIncome);
        if (!income) return null;
        // Simplified for freelancers, doesn't include pension/NHF by default.
        // A more complex implementation would make these optional.
        const consolidatedRelief = 200000 + (0.2 * income);
        let taxableIncome = income - consolidatedRelief;
        taxableIncome = Math.max(0, taxableIncome);
        const pitResult = calculatePaye(income); // use PAYE bands
        return pitResult.paye;
    }, [freelanceIncome]);

    const TabButton: React.FC<{ tabId: 'sme' | 'freelancer', text: string }> = ({ tabId, text }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tabId
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {text}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">PAYE & Personal Tax (PIT) Calculator</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Calculate payroll deductions for employees or estimate your personal tax liability.</p>

            <div className="flex justify-center mb-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                <TabButton tabId="sme" text="For SMEs (PAYE)" />
                <TabButton tabId="freelancer" text="For Freelancers (PIT)" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                {activeTab === 'sme' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">SME Payroll Calculator</h2>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Employee's Gross Monthly Salary (₦)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input type="text" id="salary" value={grossSalary} onChange={e => setGrossSalary(formatNumber(e.target.value))} className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" placeholder="e.g., 250,000" />
                        </div>
                        {smeResults && (
                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Deductions & Net Pay</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
                                        <p className="text-sm text-red-600 dark:text-red-300">PAYE</p>
                                        <p className="font-bold text-lg text-red-800 dark:text-red-200">₦{(smeResults.paye / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                                        <p className="text-sm text-blue-600 dark:text-blue-300">Pension</p>
                                        <p className="font-bold text-lg text-blue-800 dark:text-blue-200">₦{(smeResults.pension / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                                        <p className="text-sm text-indigo-600 dark:text-indigo-300">NHF</p>
                                        <p className="font-bold text-lg text-indigo-800 dark:text-indigo-200">₦{(smeResults.nhf / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                     <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                                        <p className="text-sm text-green-600 dark:text-green-300">Net Pay</p>
                                        <p className="font-bold text-lg text-green-800 dark:text-green-200">₦{(smeResults.netPay / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'freelancer' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Freelancer Personal Income Tax (PIT) Estimator</h2>
                        <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Your Total Annual Income (₦)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                             <input type="text" id="income" value={freelanceIncome} onChange={e => setFreelanceIncome(formatNumber(e.target.value))} className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" placeholder="e.g., 5,000,000" />
                        </div>
                        {freelancerResults !== null && (
                             <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Estimated Annual Tax Liability</h3>
                                <p className="mt-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">₦{freelancerResults.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                {parseFormattedNumber(freelanceIncome) <= 800000 && <p className="text-sm mt-2 text-green-600 dark:text-green-400">Your income is below the ₦800,000 threshold, so you are exempt from Personal Income Tax.</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
