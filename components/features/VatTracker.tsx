
import React, { useState, useRef, useCallback } from 'react';
import { Receipt } from '../../types';
import { extractVatFromReceipt } from '../../services/geminiService';
import { LoadingSpinner } from '../icons';

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

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Input VAT Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Track your input VAT from receipts to reduce your remittance to FIRS.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total VAT Collected (Sales)</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">₦{vatCollected.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Input VAT Paid (Costs)</h3>
                    <p className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">₦{totalInputVat.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net VAT to Remit</h3>
                    <p className={`mt-1 text-3xl font-semibold ${netVatToRemit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        ₦{netVatToRemit.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
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
                    <label 
                        htmlFor="receipt-upload"
                        className={`w-full md:w-auto px-6 py-3 border-2 border-dashed rounded-md cursor-pointer text-center ${isLoading ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'}`}
                    >
                       {isLoading ? 'Processing...' : 'Click to Upload Receipt'}
                    </label>
                    {isLoading && <LoadingSpinner className="h-6 w-6 text-indigo-600" />}
                </div>

                {error && <p className="mt-4 text-red-500">{error}</p>}

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Logged Receipts</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">VAT Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {receipts.length > 0 ? receipts.map(r => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{r.fileName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{r.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">₦{r.vatAmount.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No receipts uploaded yet.</td>
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
