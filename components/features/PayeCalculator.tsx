import React, { useState, useMemo } from 'react';
import { PayeResult } from '../../types';
import { InfoIcon } from '../icons';
import { Tooltip } from '../ui/Tooltip';

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
        const consolidatedRelief = 200000 + (0.2 * income);
        let taxableIncome = income - consolidatedRelief;
        taxableIncome = Math.max(0, taxableIncome);
        const pitResult = calculatePaye(income);
        return pitResult.paye;
    }, [freelanceIncome]);

    const TabButton: React.FC<{ tabId: 'sme' | 'freelancer', text: string }> = ({ tabId, text }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                activeTab === tabId
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
            {text}
        </button>
    );

    const ResultCard: React.FC<{ label: string; value: number; type: 'red' | 'blue' | 'indigo' | 'green'; tooltip: string }> = ({ label, value, type, tooltip }) => {
        const colors = {
            red: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-100 dark:border-red-900',
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-100 dark:border-blue-900',
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 border-indigo-100 dark:border-indigo-900',
            green: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-100 dark:border-green-900',
        };

        return (
             <div className={`p-5 rounded-xl border ${colors[type]}`}>
                <div className="flex justify-between items-center mb-1">
                    <p className={`text-sm font-medium opacity-80`}>{label}</p>
                    <Tooltip content={tooltip} position="bottom">
                         <span className="opacity-50 hover:opacity-100 cursor-pointer"><InfoIcon className="w-3.5 h-3.5" /></span>
                    </Tooltip>
                </div>
                <p className="font-bold text-xl">₦{(value / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="mb-6">
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">PAYE & Personal Tax Calculator</h1>
                 <p className="text-gray-600 dark:text-gray-400">Calculate payroll deductions for employees or estimate your personal tax liability.</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl inline-flex shadow-inner">
                    <TabButton tabId="sme" text="For SMEs (PAYE)" />
                    <TabButton tabId="freelancer" text="For Freelancers (PIT)" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                {activeTab === 'sme' && (
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">SME Payroll Calculator</h2>
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Employee's Gross Monthly Salary (₦)</label>
                            <div className="relative rounded-md shadow-sm max-w-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <span className="text-gray-500 sm:text-sm">₦</span>
                                </div>
                                <input 
                                    type="text" 
                                    id="salary" 
                                    value={grossSalary} 
                                    onChange={e => setGrossSalary(formatNumber(e.target.value))} 
                                    className="block w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-colors" 
                                    placeholder="e.g., 250,000" 
                                />
                            </div>
                        </div>
                        {smeResults && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Deductions & Net Pay</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <ResultCard label="PAYE Tax" value={smeResults.paye} type="red" tooltip="Personal Income Tax payable to the State." />
                                    <ResultCard label="Pension" value={smeResults.pension} type="blue" tooltip="8% Employee Pension Contribution." />
                                    <ResultCard label="NHF" value={smeResults.nhf} type="indigo" tooltip="2.5% National Housing Fund (if applicable)." />
                                    <ResultCard label="Net Pay" value={smeResults.netPay} type="green" tooltip="Take-home pay after statutory deductions." />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'freelancer' && (
                    <div className="space-y-6">
                         <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Freelancer PIT Estimator</h2>
                            <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Your Total Annual Income (₦)</label>
                            <div className="relative rounded-md shadow-sm max-w-md">
                                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <span className="text-gray-500 sm:text-sm">₦</span>
                                </div>
                                 <input 
                                    type="text" 
                                    id="income" 
                                    value={freelanceIncome} 
                                    onChange={e => setFreelanceIncome(formatNumber(e.target.value))} 
                                    className="block w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-colors" 
                                    placeholder="e.g., 5,000,000" 
                                />
                            </div>
                        </div>
                        {freelancerResults !== null && (
                             <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Estimated Annual Tax Liability</h3>
                                    <Tooltip content="Estimated tax based on standard Consolidated Relief Allowance." position="right">
                                        <span className="text-gray-400"><InfoIcon className="w-4 h-4"/></span>
                                    </Tooltip>
                                </div>
                                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">₦{freelancerResults.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                {parseFormattedNumber(freelanceIncome) <= 800000 && <p className="text-sm mt-2 text-green-600 dark:text-green-400 font-medium">Your income is below the ₦800,000 threshold, so you are exempt from Personal Income Tax.</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};