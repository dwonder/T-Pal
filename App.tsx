
import React, { useState, useCallback, useMemo } from 'react';
import { CompanyStatus, User, Feature, Role } from './types';
import { Login } from './components/auth/Login';
import { Classifier } from './components/features/Classifier';
import { VatTracker } from './components/features/VatTracker';
import { LevyCalculator } from './components/features/LevyCalculator';
import { PayeCalculator } from './components/features/PayeCalculator';
import { ReportGenerator } from './components/features/ReportGenerator';
import { AdminPanel } from './components/features/Admin';
import { ClassifierIcon, VatTrackerIcon, LevyCalculatorIcon, PayeCalculatorIcon, ReportGeneratorIcon, AdminIcon, LogoutIcon } from './components/icons';

// --- Role-Based Access Control (RBAC) ---
export const rolePermissions: Record<Role, Feature[]> = {
    [Role.ADMIN]: Object.values(Feature),
    [Role.ACCOUNTANT]: [Feature.CLASSIFIER, Feature.VAT, Feature.LEVY, Feature.PAYE, Feature.REPORTS],
    [Role.EMPLOYEE]: [Feature.CLASSIFIER, Feature.VAT],
};
// -----------------------------------------

// Mock Data
const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@taxpadi.com', role: Role.ADMIN },
    { id: '2', name: 'Jane Doe (Employee)', email: 'employee@taxpadi.com', role: Role.EMPLOYEE },
    { id: '3', name: 'John Smith (Accountant)', email: 'accountant@taxpadi.com', role: Role.ACCOUNTANT },
];


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [activeView, setActiveView] = useState<Feature>(Feature.CLASSIFIER);
    const [companyStatus, setCompanyStatus] = useState<CompanyStatus>(CompanyStatus.UNKNOWN);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        // Set default view based on the first permission of their role
        setActiveView(rolePermissions[user.role][0] || Feature.CLASSIFIER);
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleAddUser = (newUser: Omit<User, 'id'>) => {
        const userWithId = { ...newUser, id: new Date().toISOString() };
        setUsers(prev => [...prev, userWithId]);
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        // Also update currentUser if they are editing themselves
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };


    const renderView = useCallback(() => {
        // --- Security Enhancement: Verify user has permission to view the active feature ---
        const userPermissions = rolePermissions[currentUser!.role];
        if (!userPermissions.includes(activeView)) {
            // If a user somehow navigates to a view they don't have access to,
            // default them to a safe view (the Classifier).
            return <Classifier setCompanyStatus={setCompanyStatus} companyStatus={companyStatus} />;
        }
        // ---------------------------------------------------------------------------------

        switch (activeView) {
            case Feature.CLASSIFIER:
                return <Classifier setCompanyStatus={setCompanyStatus} companyStatus={companyStatus} />;
            case Feature.VAT:
                return <VatTracker />;
            case Feature.LEVY:
                return <LevyCalculator companyStatus={companyStatus} />;
            case Feature.PAYE:
                return <PayeCalculator />;
            case Feature.REPORTS:
                return <ReportGenerator />;
            case Feature.ADMIN:
                return <AdminPanel allUsers={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} />;
            default:
                return <Classifier setCompanyStatus={setCompanyStatus} companyStatus={companyStatus} />;
        }
    }, [activeView, companyStatus, users, currentUser]);
    
    const navItemsConfig = useMemo(() => [
        { feature: Feature.CLASSIFIER, icon: ClassifierIcon, label: 'Classifier' },
        { feature: Feature.VAT, icon: VatTrackerIcon, label: 'VAT Tracker' },
        { feature: Feature.LEVY, icon: LevyCalculatorIcon, label: 'Levy Calculator' },
        { feature: Feature.PAYE, icon: PayeCalculatorIcon, label: 'PAYE Calculator' },
        { feature: Feature.REPORTS, icon: ReportGeneratorIcon, label: 'Filing Reports' },
        { feature: Feature.ADMIN, icon: AdminIcon, label: 'Admin Panel' },
    ], []);


    if (!currentUser) {
        return <Login onLogin={handleLogin} mockUsers={users} />;
    }

    const NavItem: React.FC<{ feature: Feature; icon: React.ElementType; label: string }> = ({ feature, icon: Icon, label }) => (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveView(feature);
                    setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${activeView === feature ? 'bg-indigo-100 dark:bg-gray-700' : ''}`}
            >
                <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">{label}</span>
            </a>
        </li>
    );

    const sidebarContent = (
         <div className="h-full flex flex-col px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div>
                <a href="#" className="flex items-center ps-2.5 mb-5">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-indigo-600">TaxPadi</span>
                </a>
                <ul className="space-y-2 font-medium">
                    {navItemsConfig.map(item => {
                        if (rolePermissions[currentUser.role].includes(item.feature)) {
                            return <NavItem key={item.feature} feature={item.feature} icon={item.icon} label={item.label} />;
                        }
                        return null;
                    })}
                </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                 <div className="px-2 py-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                 </div>
                 <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
                 >
                    <LogoutIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3 font-medium">Logout</span>
                 </button>
            </div>
        </div>
    );


    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-500 bg-white rounded-md dark:bg-gray-800 dark:text-gray-300 print:hidden">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 print:hidden`}>
                {sidebarContent}
            </aside>
            
            <main className="flex-1 p-4 md:ml-64 print:ml-0 overflow-y-auto print:overflow-visible">
                 <div className="mt-12 md:mt-0">
                    {renderView()}
                 </div>
            </main>
        </div>
    );
};

export default App;
