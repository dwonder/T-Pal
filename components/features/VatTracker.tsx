import React, { useState, useRef, useCallback } from 'react';
import { Receipt } from '../../types';
import { extractVatFromReceipt } from '../../services/geminiService';
import { LoadingSpinner, InfoIcon } from '../icons';
import { Tooltip } from '../ui/Tooltip';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // remove data:mime/type;base64, part
        };
        reader.onerror = error => reject(error);
    });
};

export const VatTracker: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [vatCollected, setVatCollected] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            const base64Image = await fileToBase64(file);
            const vatAmount = await extractVatFromReceipt(base64Image, file.type);
            
            const newReceipt: Receipt = {
                id: new Date().toISOString(),
                fileName: file.name,
                vatAmount,
                date: new Date().toLocaleDateString(),
            };
            setReceipts(prev => [newReceipt, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, []);

    const totalInputVat = receipts.reduce((sum, r) => sum + r.vatAmount, 0);
    const netVatToRemit = vatCollected - totalInputVat;

    const StatCard: React.FC<{ title: string; value: string; colorClass: string; tooltip: string }> = ({ title, value, colorClass, tooltip }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <Tooltip content={tooltip} position="left">
                    <span className="text-gray-400"><InfoIcon className="w-4 h-4"/></span>
                </Tooltip>
            </div>
            <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Input VAT Tracker</h1>
                <p className="text-gray-600 dark:text-gray-400">Track your input VAT from receipts to reduce your remittance to FIRS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total VAT Collected (Sales)" 
                    value={`₦${vatCollected.toLocaleString()}`} 
                    colorClass="text-gray-900 dark:text-white"
                    tooltip="VAT you charged customers (Output VAT)."
                />
                <StatCard 
                    title="Total Input VAT Paid (Costs)" 
                    value={`₦${totalInputVat.toLocaleString()}`} 
                    colorClass="text-green-600 dark:text-green-400"
                    tooltip="VAT you paid on purchases (Input VAT)."
                />
                <StatCard 
                    title="Net VAT to Remit" 
                    value={`₦${netVatToRemit.toLocaleString()}`} 
                    colorClass={netVatToRemit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
                    tooltip="The difference payable to FIRS."
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Upload a Receipt</h2>
                <div className="flex flex-col md:flex-row items-center gap-4">
                     <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="receipt-upload"
                        disabled={isLoading}
                    />
                    <Tooltip content="We'll scan for VAT Amount automatically" position="right" className="w-full md:w-auto">
                        <label 
                            htmlFor="receipt-upload"
                            className={`block w-full px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors ${isLoading ? 'bg-gray-50 dark:bg-gray-700 border-gray-300' : 'border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}
                        >
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {isLoading ? 'Processing...' : 'Click to Upload Receipt'}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">PNG, JPG or WebP</span>
                        </label>
                    </Tooltip>
                    {isLoading && <LoadingSpinner className="h-6 w-6 text-indigo-600" />}
                </div>

                {error && <p className="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

                <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Logged Receipts</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-750">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">VAT Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {receipts.length > 0 ? receipts.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{r.fileName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{r.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">₦{r.vatAmount.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">No receipts uploaded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};