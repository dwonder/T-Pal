
import React, { useState } from 'react';
import { User } from '../../types';

interface LoginProps {
    onLogin: (user: User) => void;
    mockUsers: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, mockUsers }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // In a real app, you'd verify the password hash
        if (user) {
            setError('');
            onLogin(user);
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
                        Welcome to TaxPadi
                    </h1>
                    <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                        Sign in to manage your tax compliance
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input" className="sr-only">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Password"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Use `admin@taxpadi.com`, `accountant@taxpadi.com` or `employee@taxpadi.com`. Any password will work.
                    </p>

                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
