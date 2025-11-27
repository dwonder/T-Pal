
import React, { useState } from 'react';
import { User, Role, Feature } from '../../types';
import { rolePermissions } from '../../App';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const featureLabels: Record<Feature, string> = {
    [Feature.CLASSIFIER]: 'Classifier',
    [Feature.VAT]: 'VAT Tracker',
    [Feature.LEVY]: 'Levy Calculator',
    [Feature.PAYE]: 'PAYE Calculator',
    [Feature.REPORTS]: 'Filing Reports',
    [Feature.ADMIN]: 'Admin Panel',
};

const PermissionsModal: React.FC<{ user: User; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const [selectedRole, setSelectedRole] = useState<Role>(user.role);

    const handleSave = () => {
        onSave({ ...user, role: selectedRole });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Role for {user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign Role</label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as Role)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                        >
                            {Object.values(Role).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h3 className="text-md font-medium text-gray-800 dark:text-white">Role Permissions:</h3>
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {rolePermissions[selectedRole].map(feature => (
                                <li key={feature}>{featureLabels[feature]}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC<{ allUsers: User[]; onAddUser: (user: Omit<User, 'id'>) => void; onUpdateUser: (user: User) => void; }> = ({ allUsers, onAddUser, onUpdateUser }) => {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<Role>(Role.EMPLOYEE);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) {
            return; // Basic validation
        }
        onAddUser({ name: newName, email: newEmail, role: newRole });
        setNewName('');
        setNewEmail('');
        setNewRole(Role.EMPLOYEE);
    };

    const roleColors: Record<Role, string> = {
        [Role.ADMIN]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
        [Role.ACCOUNTANT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
        [Role.EMPLOYEE]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your team's access to TaxPadi features by assigning roles.</p>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Create New User</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="newName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            placeholder="e.g., Bola Ahmed"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            placeholder="e.g., bola@company.com"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                        />
                    </div>
                     <div className="md:col-span-1">
                        <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            id="newRole"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as Role)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                        >
                            {Object.values(Role).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Accessible Features</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {allUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal">
                                        <div className="flex flex-wrap gap-1">
                                            {rolePermissions[user.role].map(feature => (
                                                <span key={feature} className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full dark:bg-gray-600 dark:text-gray-200">
                                                    {featureLabels[feature]}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && <PermissionsModal user={editingUser} onClose={() => setEditingUser(null)} onSave={onUpdateUser} />}
        </div>
    );
};
