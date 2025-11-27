import React, { useState } from 'react';
import { CopyIcon } from '../icons';
import { Tooltip } from '../ui/Tooltip';

const ReportCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex justify-between items-center transition-all hover:shadow-lg">
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
            <Tooltip content={copied ? "Copied!" : "Copy value"} position="left">
                <button 
                    onClick={copyToClipboard}
                    className={`p-2 rounded-full transition-colors ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'}`}
                >
                    <CopyIcon className="h-5 w-5" />
                </button>
            </Tooltip>
        </div>
    );
};


export const ReportGenerator: React.FC = () => {
    // In a real app, this data would come from props/state management
    const mockData = {
        totalSales: "₦15,450,000.00",
        totalExpenses: "₦8,200,000.00",
        assessableProfit: "₦7,250,000.00",
        citPayable: "₦0.00 (Small Company)",
        developmentLevy: "₦0.00 (Small Company)",
        totalVatCollected: "₦850,250.00",
        totalInputVat: "₦315,100.00",
        netVatToRemit: "₦535,150.00",
        totalPayeRemitted: "₦1,250,000.00",
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">TaxPro-Max Filing Report</h1>
                <p className="text-gray-600 dark:text-gray-400">Your simplified report with the exact numbers needed for the FIRS TaxPro-Max portal.</p>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Company Income Tax (CIT) Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total Sales (Turnover)" value={mockData.totalSales} />
                        <ReportCard title="Total Allowable Expenses" value={mockData.totalExpenses} />
                        <ReportCard title="Assessable Profit" value={mockData.assessableProfit} />
                        <ReportCard title="CIT Payable" value={mockData.citPayable} />
                        <ReportCard title="4% Development Levy" value={mockData.developmentLevy} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Value Added Tax (VAT) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total VAT Collected (Output)" value={mockData.totalVatCollected} />
                        <ReportCard title="Total VAT Paid (Input)" value={mockData.totalInputVat} />
                        <ReportCard title="Net VAT to Remit" value={mockData.netVatToRemit} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Pay-As-You-Earn (PAYE) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ReportCard title="Total PAYE Remitted" value={mockData.totalPayeRemitted} />
                    </div>
                </div>
            </div>
        </div>
    );
};