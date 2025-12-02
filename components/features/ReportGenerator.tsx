
import React, { useState } from 'react';
import { CopyIcon, DownloadIcon, PrinterIcon, BellIcon } from '../icons';
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

    const [reminderEmail, setReminderEmail] = useState('');
    const [isReminderSet, setIsReminderSet] = useState(false);

    const handleSetReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (reminderEmail) {
            setIsReminderSet(true);
            // Simulate API call and feedback
            setTimeout(() => {
                setIsReminderSet(false);
                setReminderEmail('');
            }, 3000);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Total Sales (Turnover)', mockData.totalSales],
            ['Total Allowable Expenses', mockData.totalExpenses],
            ['Assessable Profit', mockData.assessableProfit],
            ['CIT Payable', mockData.citPayable],
            ['4% Development Levy', mockData.developmentLevy],
            ['Total VAT Collected (Output)', mockData.totalVatCollected],
            ['Total VAT Paid (Input)', mockData.totalInputVat],
            ['Net VAT to Remit', mockData.netVatToRemit],
            ['Total PAYE Remitted', mockData.totalPayeRemitted],
        ];

        // Format CSV content with proper escaping for quotes
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "taxpadi_filing_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 print:max-w-none print:p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">TaxPro-Max Filing Report</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your simplified report with the exact numbers needed for the FIRS TaxPro-Max portal.</p>
                </div>
                <div className="flex gap-3 print:hidden">
                    <Tooltip content="Download as CSV">
                         <button 
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                         >
                            <DownloadIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Export CSV</span>
                         </button>
                    </Tooltip>
                    <Tooltip content="Print or Save as PDF">
                         <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                         >
                            <PrinterIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Print / PDF</span>
                         </button>
                    </Tooltip>
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 mb-8 print:hidden shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <BellIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                             <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Tax Deadline Reminders</h3>
                        </div>
                        <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-2">
                            Don't miss a deadline. Get notified via email or in-app when your filings are due.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                VAT: 21st Monthly
                            </span>
                            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                CIT: 30th June
                            </span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSetReminder} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                         <input 
                            type="email" 
                            placeholder="your@email.com"
                            value={reminderEmail}
                            onChange={(e) => setReminderEmail(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm w-full md:w-64"
                            required
                        />
                        <button 
                            type="submit"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm whitespace-nowrap ${isReminderSet 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isReminderSet ? 'Reminder Set!' : 'Set Reminder'}
                        </button>
                    </form>
                </div>
             </div>

            <div className="space-y-8 print:space-y-6">
                <div className="break-inside-avoid">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Company Income Tax (CIT) Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total Sales (Turnover)" value={mockData.totalSales} />
                        <ReportCard title="Total Allowable Expenses" value={mockData.totalExpenses} />
                        <ReportCard title="Assessable Profit" value={mockData.assessableProfit} />
                        <ReportCard title="CIT Payable" value={mockData.citPayable} />
                        <ReportCard title="4% Development Levy" value={mockData.developmentLevy} />
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Value Added Tax (VAT) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportCard title="Total VAT Collected (Output)" value={mockData.totalVatCollected} />
                        <ReportCard title="Total VAT Paid (Input)" value={mockData.totalInputVat} />
                        <ReportCard title="Net VAT to Remit" value={mockData.netVatToRemit} />
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Pay-As-You-Earn (PAYE) Summary</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ReportCard title="Total PAYE Remitted" value={mockData.totalPayeRemitted} />
                    </div>
                </div>
            </div>
        </div>
    );
};
