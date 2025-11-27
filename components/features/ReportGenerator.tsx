import React from 'react';

const ReportCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        // Add a small visual feedback if desired
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
            <button 
                onClick={copyToClipboard}
                title="Copy to clipboard"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLineCap="round" strokeLineJoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">TaxPro-Max Filing Report</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Your simplified report with the exact numbers needed for the FIRS TaxPro-Max portal. Click the copy icon to copy values.</p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Company Income Tax (CIT) Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total Sales (Turnover)" value={mockData.totalSales} />
                        <ReportCard title="Total Allowable Expenses" value={mockData.totalExpenses} />
                        <ReportCard title="Assessable Profit" value={mockData.assessableProfit} />
                        <ReportCard title="CIT Payable" value={mockData.citPayable} />
                        <ReportCard title="4% Development Levy" value={mockData.developmentLevy} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Value Added Tax (VAT) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total VAT Collected (Output)" value={mockData.totalVatCollected} />
                        <ReportCard title="Total VAT Paid (Input)" value={mockData.totalInputVat} />
                        <ReportCard title="Net VAT to Remit" value={mockData.netVatToRemit} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Pay-As-You-Earn (PAYE) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ReportCard title="Total PAYE Remitted" value={mockData.totalPayeRemitted} />
                    </div>
                </div>
            </div>
        </div>
    );
};